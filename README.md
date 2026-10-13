# ai-agent-video-editor-gemini

A Gemini-powered agent scaffold for the original video-editing workflow. This repository keeps the `video-use` idea but replaces the previous hardcoded provider assumptions with a lightweight Gemini integration using the Gemini API key flow.

## What is included

- CLI singlular entry point for agent tasks
- Gemini client wrapper using `fetch` + the Gemini REST API
- structured planning prompts for a video-editing workflow
- safe environment config loading from `.env`
- TypeScript build/test setup
- Dockerfile and production-ready startup scripts

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Add your Gemini API key:

```bash
GEMINI_API_KEY=your_key_here
```

4. Run a test prompt:

```bash
npm run dev -- agent "Plan a 30-second social video from three raw clips."
```

5. Build for production:

```bash
npm run build
npm start -- agent "Create a short video editing workflow for a product launch."
```

## CLI usage

```bash
npm run dev -- --help
```

Available commands:

```bash
npm run dev -- agent "Describe a video editing plan"
npm run dev -- plan "Create a 15-second cut for a talking-head clip"
npm run dev -- health
```

## Environment variables

- `GEMINI_API_KEY`: Google Gemini API key
- `GEMINI_MODEL`: default `gemini-2.0-flash`
- `GEMINI_TEMPERATURE`: generation temperature, default `0.5`
- `LOG_LEVEL`: `debug`, `info`, `warn`, `error`

## Notes

This is intentionally lightweight and designed to be a working Gemini-enabled base for your agentic video workflow. You can keep building on top of it with actual video extraction, transcript handling, ffmpeg render logic, and deeper orchestration.

## Docker

```bash
docker build -t ai-agent-video-editor-gemini .
docker run --rm -e GEMINI_API_KEY=your_key_here ai-agent-video-editor-gemini agent "Create a short cut plan for a podcast clip"
```
