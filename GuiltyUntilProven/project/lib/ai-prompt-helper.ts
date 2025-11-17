import { Suspect } from './stores/game-store';
import { CrimeScenario } from './game/scenario-generator';

/**
 * Generates a system prompt for the AI to role-play as a suspect
 * Ensures the suspect stays consistent with their alibi and personality
 */
export function generateSuspectPrompt(
  suspect: Suspect,
  allSuspects: Suspect[],
  scenario: CrimeScenario
): string {
  const otherSuspects = allSuspects
    .filter(s => s.name !== suspect.name)
    .map(s => `${s.name} (${s.role})`)
    .join(', ');

  // Build information about what the suspect knows
  const suspectKnowledge = buildSuspectKnowledge(suspect, allSuspects, scenario);

  const crimeDescription = getCrimeDescription(scenario);
  const impostorAction = getImpostorAction(scenario);

  return `You are ${suspect.name}, a ${suspect.role} on a space station. You are being interrogated about ${crimeDescription} that occurred at exactly ${scenario.timeOfCrime} in the ${scenario.location.name}.

CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THESE EXACTLY:
1. Your personality is ${suspect.personality}
2. Your claimed alibi: You were in the ${suspect.alibi} at ${scenario.timeOfCrime}
3. Your ACTUAL location at ${scenario.timeOfCrime}: ${suspect.actualLocation}
4. You are ${suspect.isImpostor ? `THE IMPOSTOR (you ${impostorAction})` : 'INNOCENT'}

${suspect.isImpostor ? `
AS THE IMPOSTOR:
- You ${impostorAction} in the ${scenario.location.name} at ${scenario.timeOfCrime}
- You disabled the security cameras from ${getTimeMinusTwo(scenario.timeOfCrime)} to cover your tracks
- You will CLAIM you were in ${suspect.alibi}, but you were ACTUALLY in the ${scenario.location.name}
- Your motive: ${scenario.motive}
- You should try to deflect suspicion and seem believable
- Do NOT directly admit to the crime unless heavily pressed with evidence
- You may act nervous, defensive, or try to blame others subtly
- Stay consistent: Always claim you were in ${suspect.alibi}
` : `
AS AN INNOCENT CREW MEMBER:
- You did NOT commit the crime
- You were ACTUALLY in the ${suspect.actualLocation} at ${scenario.timeOfCrime}
- You should tell the TRUTH about your location: ${suspect.actualLocation}
- You have nothing to hide
- Answer questions honestly based on what you would know from ${suspect.actualLocation}
- You can provide details about what you were doing in ${suspect.actualLocation}
`}

WHAT YOU KNOW ABOUT OTHER CREW MEMBERS:
${suspectKnowledge}

OTHER CREW MEMBERS: ${otherSuspects}

RESPONSE GUIDELINES:
- Keep responses under 100 words
- Stay in character with your personality: ${suspect.personality}
- Be consistent - never contradict your previous statements
- ${suspect.isImpostor 
    ? 'Maintain your false alibi unless confronted with undeniable evidence' 
    : 'Tell the truth about where you were and what you saw'}
- Do not volunteer information about other suspects unless asked
- Act natural - don't be overly suspicious or defensive unless it fits your personality
- Never mention being an AI or break character

Remember: You are ${suspect.name}. Respond as this character would in an interrogation.`;
}

/**
 * Helper function to get a description of the crime
 */
function getCrimeDescription(scenario: CrimeScenario): string {
  const descriptions: Record<string, string> = {
    murder: 'a murder',
    sabotage: 'an act of sabotage',
    theft: 'a theft',
    smuggling: 'smuggling contraband',
    espionage: 'espionage and data leaking',
    poisoning: 'a poisoning',
    arson: 'arson'
  };
  return descriptions[scenario.crimeType] || 'a crime';
}

/**
 * Helper function to get the impostor's action description
 */
function getImpostorAction(scenario: CrimeScenario): string {
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
}

/**
 * Helper function to subtract 2 minutes from a time string
 */
function getTimeMinusTwo(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes - 2;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

/**
 * Builds knowledge that a suspect would have about other crew members
 * This helps the AI give appropriate witness information
 */
function buildSuspectKnowledge(
  suspect: Suspect,
  allSuspects: Suspect[],
  scenario: CrimeScenario
): string {
  const knowledge: string[] = [];

  // What would this suspect know based on their location?
  for (const other of allSuspects) {
    if (other.name === suspect.name) continue;

    // Determine if this suspect could have witnessed the other suspect
    const couldWitness = determineWitnessKnowledge(suspect, other, scenario);
    if (couldWitness) {
      knowledge.push(couldWitness);
    }
  }

  if (knowledge.length === 0) {
    return `- You did not see any other crew members around ${scenario.timeOfCrime}`;
  }

  return knowledge.map(k => `- ${k}`).join('\n');
}

/**
 * Determines what one suspect would know about another based on their locations
 */
function determineWitnessKnowledge(
  witness: Suspect,
  subject: Suspect,
  scenario: CrimeScenario
): string | null {
  const timeMinusFive = getTimeMinusMinutes(scenario.timeOfCrime, 5);
  const timeMinusOne = getTimeMinusMinutes(scenario.timeOfCrime, 1);
  const timeMinusTwo = getTimeMinusMinutes(scenario.timeOfCrime, 2);

  // Generic adjacency - some locations might be near each other
  const adjacentLocations: Record<string, string[]> = {
    'Research Lab': ['Engineering', 'Med Bay'],
    'Engineering': ['Research Lab', 'Life Support'],
    'Med Bay': ['Research Lab', 'Quarters'],
    'Communications Bay': ['Command Center', 'Server Room'],
    'Security Office': ['Armory', 'Command Center'],
    'Cargo Hold': ['Armory', 'Engineering'],
    'Life Support': ['Engineering', 'Med Bay']
  };

  // Check if witness was in an adjacent location and could see the subject
  const witnessAdjacent = adjacentLocations[witness.actualLocation] || [];
  if (witnessAdjacent.includes(subject.actualLocation)) {
    return `You saw ${subject.name} in the ${subject.actualLocation} around ${timeMinusFive}`;
  }

  // Security personnel watching cameras
  if (witness.actualLocation === 'Security Office' && subject.actualLocation !== scenario.location.name) {
    return `You saw ${subject.name} on cameras in the ${subject.actualLocation} until the cameras went offline at ${timeMinusTwo}`;
  }

  // People near the crime scene might hear something
  if (witnessAdjacent.includes(scenario.location.name) && subject.actualLocation === scenario.location.name) {
    return `You heard suspicious sounds coming from the ${scenario.location.name} at ${timeMinusOne}`;
  }

  return null;
}

/**
 * Helper to subtract minutes from time
 */
function getTimeMinusMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins - minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

/**
 * Formats the conversation history for the AI
 */
export function formatConversationHistory(
  history: Array<{ question: string; answer: string }>
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  for (const entry of history) {
    messages.push(
      { role: 'user', content: entry.question },
      { role: 'assistant', content: entry.answer }
    );
  }

  return messages;
}

/**
 * Validates that a suspect's response is consistent with their alibi
 * This can be used for debugging/testing
 */
export function validateResponse(
  suspect: Suspect,
  response: string,
  scenario: CrimeScenario
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const lowerResponse = response.toLowerCase();

  // Check if innocent suspects are claiming wrong locations
  if (!suspect.isImpostor) {
    const claimedLocation = suspect.alibi.toLowerCase();
    const actualLocation = suspect.actualLocation.toLowerCase();

    if (claimedLocation !== actualLocation) {
      issues.push(`Warning: Innocent suspect should claim their actual location (${actualLocation}), not a false alibi`);
    }
  }

  // Check if response contradicts the alibi
  if (suspect.isImpostor) {
    const crimeLocation = scenario.location.name.toLowerCase();

    if (lowerResponse.includes(crimeLocation) && lowerResponse.includes('was in')) {
      issues.push(`Warning: Impostor mentioned being in ${scenario.location.name} - should maintain false alibi`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}