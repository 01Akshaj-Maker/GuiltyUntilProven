# AI Detective Game

An interactive detective game where you interrogate AI-powered suspects to find the impostor. Built with Next.js 14, Supabase, and Google Gemini 2.5 Flash.

## Features

- **AI-Powered Interrogations**: Chat with 5 unique AI suspects, each with their own personality and secrets
- **Three Difficulty Levels**: Easy (3 suspects, 15 questions), Medium (5 suspects, 12 questions), Hard (5 suspects, 8 questions)
- **Evidence Discovery System**: Discover hidden evidence through smart questioning
- **Evidence Linking**: Connect clues to suspects to build your case
- **User Authentication**: Sign up and track your detective career
- **Global Leaderboard**: Compete with other players worldwide
- **Personal Statistics**: Track your win rate, solve times, and more

## The Crime

A classified data drive has been stolen from the Server Room at exactly 14:45. Security cameras were disabled during the theft. One of the crew members is the impostor. Use your limited questions wisely to uncover the truth.

## Getting Started

### Prerequisites

1. A Supabase account and project (already configured)
2. A Google Gemini API key

### Setup

1. **Get your Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

2. **Add the API Key to your environment**:
   - Open the `.env` file
   - Replace `your_gemini_api_key_here` with your actual Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_api_key
     ```

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Create an account or sign in
   - Start playing!

## How to Play

1. **Select Difficulty**: Choose between Easy, Medium, or Hard
2. **Review the Briefing**: Learn about the crime and the suspects
3. **Interrogate Suspects**: Click on a suspect to start asking questions
4. **Discover Evidence**: Smart questions reveal hidden clues
5. **Link Evidence**: Click evidence, then click a suspect to link them
6. **Make Your Accusation**: You only get one chance - choose wisely!

## The Suspects

- **Alex Chen** (👨‍🔧) - Engineer - Confident and straightforward
- **Sam Rivera** (👨‍✈️) - Pilot - Nervous and defensive
- **Jamie Park** (👩‍🔬) - Scientist - Analytical and precise
- **Riley Moore** (👩‍💼) - Communications Officer - Friendly and talkative
- **Morgan Blake** (👮) - Security Officer - Suspicious and interrogative

## Tips for Success

- Ask about alibis and who can verify their location
- Check who has access credentials to the Server Room
- Look for suspects with vague answers or no witnesses
- Link evidence to suspects to track inconsistencies
- The impostor will try to lie convincingly - look for contradictions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini 2.5 Flash API
- **Animations**: Framer Motion, canvas-confetti

## Database Schema

The game uses three main tables:
- `profiles`: User information linked to auth
- `game_stats`: Detailed statistics for every game played
- `user_leaderboard`: Materialized view for rankings

## API Routes

- `/api/ai/ask`: Server-side endpoint for Gemini AI integration
  - Handles all AI requests securely
  - Comprehensive error handling
  - Retry logic for failed requests
  - Fallback responses for empty results

## Security Features

- Row Level Security (RLS) enabled on all tables
- API keys stored server-side only
- Authenticated requests for all game operations
- Secure password handling with Supabase Auth

## Troubleshooting

### AI Not Responding
- Check that your `GEMINI_API_KEY` is correctly set in `.env`
- Ensure the API key has proper permissions
- Check the browser console for error messages

### Database Errors
- Verify your Supabase connection details are correct
- Check that the database migrations ran successfully
- Ensure Row Level Security policies are properly configured

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Development

### Project Structure
```
app/
  ├── api/ai/ask/route.ts    # AI integration endpoint
  ├── layout.tsx              # Root layout
  └── page.tsx                # Main game orchestrator
components/
  ├── auth/                   # Login/Signup forms
  ├── game/                   # All game screens
  └── ui/                     # shadcn/ui components
lib/
  ├── stores/                 # Zustand game store
  ├── supabase/              # Database utilities
  └── utils.ts               # Helper functions
```

### Running Tests
```bash
npm run lint       # Check for linting errors
npm run typecheck  # Type check without emitting
npm run build      # Production build
```

## Deployment

Ready to deploy? See the [Deployment Guide](DEPLOYMENT.md) for:
- Platform-specific instructions (Vercel, Netlify, Railway, etc.)
- Troubleshooting common deployment issues
- Environment variable configuration
- Post-deployment testing checklist

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get your database running in 5 minutes
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Detailed database setup guide
- **[DATABASE_SUMMARY.md](DATABASE_SUMMARY.md)** - Database architecture overview
- **[SECURITY_FIXES.md](SECURITY_FIXES.md)** - Security configuration guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment troubleshooting guide

## License

This project is open source and available for educational purposes.

## Credits


Built with ❤️ using modern web technologies and AI.