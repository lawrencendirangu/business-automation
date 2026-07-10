# Al-Masar AI Automation Dashboard

Modern SaaS dashboard MVP built with React, Vite, Tailwind CSS, and TypeScript.

Phase 2.1 now includes a real WhatsApp Business webhook integration for Recent Conversations.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- Lucide React icons
- Node.js + Express webhook/API service

## Run Locally

1. Install dependencies

npm install

2. Copy environment file

copy .env.example .env

3. Set your webhook verify token in .env

WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-secret-token

4. Run frontend + backend together

npm run dev:full

Frontend runs on http://localhost:5173 (or next available port).
Backend API runs on http://localhost:8787.

## WhatsApp Business Setup (Meta Cloud API)

Recent Conversations are filled from incoming WhatsApp webhook events.

1. In Meta Developer App, open WhatsApp product
2. Configure Webhook URL:
   - https://your-public-domain/api/whatsapp/webhook
3. Configure Verify Token:
   - must match WHATSAPP_WEBHOOK_VERIFY_TOKEN in .env
4. Subscribe webhook field:
   - messages
5. Send a test WhatsApp message to your connected business number
6. Open dashboard and see Recent Conversations update automatically

## Local Webhook Testing

Meta requires a public HTTPS URL for webhook callbacks.
For local testing, expose the backend using a tunnel (for example ngrok or cloudflared) and use that HTTPS URL in Meta.

Example route path to expose:
- /api/whatsapp/webhook

## API Endpoints

- GET /api/health
- GET /api/whatsapp/conversations?limit=6
- GET /api/whatsapp/webhook (Meta verification)
- POST /api/whatsapp/webhook (incoming messages)

## Notes

- Only Recent Conversations were switched from mock data to real data in this phase.
- KPI cards, automations, and AI agents are still mock data for now.
- Received messages are stored in server/data/messages.json for local MVP persistence.
