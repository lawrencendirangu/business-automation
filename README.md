# Al-Masar AI Automation Dashboard

Modern SaaS dashboard MVP built with React, Vite, Tailwind CSS, and TypeScript.

Phase 2.1 connects the dashboard to the existing bot inbox backend and shows real conversations from the shared inbox.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- Lucide React icons
- Inbox backend at `https://whatsapp-bot-production-9919.up.railway.app` (configurable via `VITE_API_BASE_URL`)

## Project Layout

- Frontend dashboard: Vite app in this repository
- Inbox data source: existing bot backend exposed through `/inbox/*` routes
- WhatsApp webhook support: handled by the bot backend, not this dashboard app

## Run Locally

1. Install dependencies

npm install

2. Copy environment file

copy .env.example .env

3. Set the inbox backend URL in `.env`

VITE_API_BASE_URL=http://localhost:8787

4. Keep your webhook values available in `.env`

WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-secret-token

5. Run the frontend dashboard

npm run dev

6. Make sure your bot backend is running on port 8787 (or set `VITE_API_BASE_URL` to your backend URL)

## What the Dashboard Uses

The dashboard makes direct API requests to the bot backend:

- GET /inbox/conversations
- GET /inbox/notifications
- GET /inbox/conversations/:conversationId
- POST /inbox/conversations/:conversationId/reply
- POST /inbox/conversations/:conversationId/takeover
- POST /inbox/conversations/:conversationId/resume-ai

Polling runs every 5 seconds for conversations, notifications, and the selected conversation messages.

## Deployment Notes

For production:

1. Host the dashboard on a frontend platform such as Vercel or Netlify.
2. Point `VITE_API_BASE_URL` to your deployed bot backend.
3. Host the bot backend on a public HTTPS service such as Railway, Render, or Fly.io.
4. Keep the WhatsApp webhook configured on the backend service, not on the dashboard app.
5. Use a managed database for inbox persistence and audit logs instead of local files.

## Authentication Roadmap

Authentication is not enabled yet in this MVP.

Planned next step:

1. Add login/session handling for dashboard users.
2. Protect inbox actions behind roles such as admin, agent, and viewer.
3. Map each user to a business account for multi-business support.
4. Replace temporary UI profile labels with authenticated user data.

## WhatsApp Business Setup (Meta Cloud API)

Recent Conversations are filled from the bot backend inbox data.

1. In Meta Developer App, open the WhatsApp product.
2. Configure the webhook URL on the bot backend.
3. Configure the verify token to match the backend environment.
4. Subscribe to the `messages` webhook field.
5. Send a test WhatsApp message to the connected business number.
6. Open the dashboard and confirm the conversation appears.

## Local Webhook Testing

If you need to test webhook delivery locally, expose the bot backend with a tunnel such as ngrok or Cloudflare Tunnel and point Meta to that public HTTPS URL.

Example route path for the dashboard inbox backend:
- `/inbox/conversations`

## API Endpoints

- GET /inbox/conversations
- GET /inbox/notifications
- GET /inbox/conversations/:conversationId
- POST /inbox/conversations/:conversationId/reply
- POST /inbox/conversations/:conversationId/takeover
- POST /inbox/conversations/:conversationId/resume-ai

## Notes

- KPI cards, automations, and AI agents are still placeholder UI data for now.
- Inbox data is loaded from the external bot backend, not from local mock endpoints.
- Authentication and role-based access control will be added in the next phase.
