# AI Video Automation Agent

An intelligent automation system that scans trending videos, generates AI prompts, creates videos, and uploads them to YouTube automatically.

## Features

- 🔍 **Trend Scanner**: Automatically discovers popular and trending videos
- 📝 **Google Docs Integration**: Logs all activity and video ideas
- ✨ **AI Prompt Generation**: Creates detailed video prompts using GPT-4
- 🎬 **Video Generation**: Integrates with Veo3/Sora for AI video creation
- 📤 **YouTube Upload**: Automatically uploads generated videos
- 📊 **Real-time Dashboard**: Monitor the entire pipeline

## Architecture

1. **YouTube Scraper** - Discovers trending content
2. **Prompt Generator** - AI-powered prompt creation
3. **Video Generator** - AI video synthesis
4. **YouTube Uploader** - Automated publishing
5. **Google Docs Logger** - Activity tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Add your API keys:
- Google OAuth credentials
- OpenAI API key
- YouTube Data API key
- Video generation API keys (Veo3/Sora)

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## API Endpoints

- `POST /api/run-agent` - Start the automation pipeline
- `GET /api/status` - Check agent status
- `GET /api/auth/callback` - OAuth callback handler

## Demo Mode

The application runs in demo mode with simulated data when API keys are not configured. This allows you to test the interface and workflow.

## Production Setup

For full functionality, configure:

1. **Google Cloud Console**:
   - Enable Google Docs API
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials

2. **OpenAI**:
   - Get API key from platform.openai.com

3. **Video Generation**:
   - Access to Veo3 or Sora API (when available)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Google APIs
- OpenAI API
- SWR for data fetching

## License

MIT
