import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface RequestBody {
  suspect: {
    name: string;
    role: string;
    personality: string;
    alibi: string;
    actualLocation: string;
    isImpostor: boolean;
  };
  question: string;
  history: Array<{ question: string; answer: string }>;
  scenario?: {
    crimeType: string;
    location: {
      name: string;
      description: string;
    };
    timeOfCrime: string;
    description: string;
    motive: string;
  };
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
}

const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
const REQUEST_TIMEOUT = 30000;

async function callGeminiWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
}

function buildPrompt(suspect: RequestBody['suspect'], question: string, history: RequestBody['history'], scenario?: RequestBody['scenario']): string {
  const historyText = history.length > 0
    ? `\n\nPrevious conversation:\n${history.map(h => `Detective: ${h.question}\nYou: ${h.answer}`).join('\n')}`
    : '';

  const crimeLocation = scenario?.location.name || 'Server Room';
  const crimeTime = scenario?.timeOfCrime || '14:45';
  const crimeDescription = scenario?.description || 'A classified data drive was stolen from the Server Room';
  const crimeMotive = scenario?.motive || 'unknown reasons';

  const getCrimeAction = () => {
    if (!scenario) return 'stole the data drive';
    const actions: Record<string, string> = {
      murder: 'killed the crew member',
      sabotage: 'sabotaged the critical systems',
      theft: 'stole the valuable item',
      smuggling: 'smuggled the contraband',
      espionage: 'leaked the classified information',
      poisoning: 'poisoned the crew member',
      arson: 'started the fire'
    };
    return actions[scenario.crimeType] || 'committed the crime';
  };

  const basePrompt = `You are ${suspect.name}, a ${suspect.role} on a space station.

Your personality: ${suspect.personality}

THE CRIME:
${crimeDescription}

YOUR SITUATION:
${suspect.isImpostor
    ? `You are the impostor. You actually ${getCrimeAction()} in the ${crimeLocation} at ${crimeTime}. Your motive: ${crimeMotive}. However, you claim you were at: ${suspect.alibi}. You must lie convincingly but stay consistent. Be vague about witnesses and details. Get slightly defensive if pressed hard. Never directly admit guilt unless overwhelming evidence is presented.`
    : `You are innocent. You were actually at: ${suspect.actualLocation} at ${crimeTime}. This is the truth. You have nothing to hide. Be cooperative and provide specific details about your location. You may mention seeing other crew members or specific activities that prove your innocence.`
}

IMPORTANT RULES:
- Stay in character at all times
- Keep responses to 2-3 sentences maximum
- Match your personality trait (${suspect.personality})
- Be consistent with previous answers
- Never break character or mention being AI
${suspect.isImpostor ? '- Lie about your location but stay believable' : '- Tell the truth about your location'}

${historyText}

Detective: ${question}
You:`;

  return basePrompt;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured. Please check server configuration.' },
        { status: 500 }
      );
    }

    let body: RequestBody;
    try {
      body = await request.json();
      console.log('Received question for:', body.suspect?.name);
    } catch (error: any) {
      console.error('Failed to parse request body:', error.message);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { suspect, question, history, scenario } = body;

    if (!suspect || !question) {
      return NextResponse.json(
        { error: 'Missing required fields: suspect and question' },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(suspect, question, history || [], scenario);

    let response: Response;
    let attemptCount = 0;
    const maxAttempts = 2;

    while (attemptCount < maxAttempts) {
      attemptCount++;

      try {
        response = await callGeminiWithTimeout(
          `${GEMINI_API_ENDPOINT}?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.9,
                maxOutputTokens: 200,
              },
            }),
          }
        );

        if (response.status === 401 || response.status === 403) {
          console.error('Invalid API key - authentication failed');
          return NextResponse.json(
            { error: 'AI service authentication failed. Please check your API key configuration.' },
            { status: 500 }
          );
        }

        if (response.status === 429) {
          console.error('Rate limit exceeded');
          return NextResponse.json(
            { error: 'Too many requests. Please wait a moment and try again.' },
            { status: 429 }
          );
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Gemini API error (${response.status}):`, errorText);

          if (attemptCount < maxAttempts) {
            console.log(`Retrying... (attempt ${attemptCount + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          return NextResponse.json(
            { error: 'AI service is temporarily unavailable. Please try again.' },
            { status: 500 }
          );
        }

        let data: GeminiResponse;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Failed to parse Gemini response:', parseError);

          if (attemptCount < maxAttempts) {
            console.log(`Retrying due to parse error... (attempt ${attemptCount + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          return NextResponse.json(
            { error: 'Received invalid response from AI service. Please try again.' },
            { status: 500 }
          );
        }

        if (data.error) {
          console.error('Gemini API error in response:', data.error);
          return NextResponse.json(
            { error: `AI service error: ${data.error.message}` },
            { status: 500 }
          );
        }

        if (!data.candidates || data.candidates.length === 0) {
          console.error('No candidates in Gemini response');

          if (attemptCount < maxAttempts) {
            console.log(`Retrying due to empty response... (attempt ${attemptCount + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          return NextResponse.json(
            { answer: getFallbackAnswer(suspect, question) },
            { status: 200 }
          );
        }

        const candidate = data.candidates[0];
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          console.error('Invalid candidate structure in Gemini response');

          if (attemptCount < maxAttempts) {
            console.log(`Retrying due to invalid structure... (attempt ${attemptCount + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          return NextResponse.json(
            { answer: getFallbackAnswer(suspect, question) },
            { status: 200 }
          );
        }

        const answerText = candidate.content.parts[0].text;
        if (!answerText || answerText.trim() === '') {
          console.error('Empty text in Gemini response');

          if (attemptCount < maxAttempts) {
            console.log(`Retrying due to empty text... (attempt ${attemptCount + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          return NextResponse.json(
            { answer: getFallbackAnswer(suspect, question) },
            { status: 200 }
          );
        }

        return NextResponse.json({ answer: answerText.trim() });

      } catch (fetchError: any) {
        console.error(`Fetch error (attempt ${attemptCount}/${maxAttempts}):`, fetchError);

        if (attemptCount < maxAttempts) {
          console.log(`Retrying after error... (attempt ${attemptCount + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        if (fetchError.message.includes('timeout')) {
          return NextResponse.json(
            { error: 'Request took too long. Please try again.' },
            { status: 408 }
          );
        }

        return NextResponse.json(
          { error: 'Failed to connect to AI service. Please check your connection and try again.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { answer: getFallbackAnswer(suspect, question) },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Unexpected error in AI route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

function getFallbackAnswer(suspect: RequestBody['suspect'], question: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('where were you') || lowerQuestion.includes('location') || lowerQuestion.includes('alibi')) {
    return `I was at ${suspect.alibi} during that time. ${suspect.isImpostor ? "Why are you asking me this?" : "I can provide more details if needed."}`;
  }

  if (lowerQuestion.includes('witness') || lowerQuestion.includes('saw you') || lowerQuestion.includes('prove')) {
    return suspect.isImpostor
      ? "I don't need to prove anything to you. I was where I said I was."
      : "I believe some crew members can confirm my whereabouts. Check with them.";
  }

  if (lowerQuestion.includes('engineer') || lowerQuestion.includes('access') || lowerQuestion.includes('credentials')) {
    return suspect.role.toLowerCase().includes('engineer') || suspect.role.toLowerCase().includes('pilot')
      ? "Yes, I have Engineer-level access for my job duties."
      : "No, I don't have Engineer-level access. That's not part of my role.";
  }

  if (suspect.isImpostor) {
    return "I've already told you everything I know. I had nothing to do with this.";
  } else {
    return `As I mentioned, I was at ${suspect.actualLocation}. I'm happy to answer any questions to help solve this.`;
  }
}