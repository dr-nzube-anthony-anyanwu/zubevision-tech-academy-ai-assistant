# ZubeVision Tech Academy AI Assistant

ZubeVision Tech Academy AI Assistant is an AI-powered web assistant built to help prospective students get clear, structured answers about ZubeVision Tech Academy programs, fees, schedules, registration, payment information, and academy policies.

The project combines a FastAPI backend, a branded Next.js frontend, a markdown knowledge base, OpenRouter-powered AI responses, Supabase lead capture, and Make-powered email notifications.

## Author

Built by **Dr. Anthony .N. Anyanwu**.

**Role:** AI Systems Architect & Engineer | Data Scientist | Optometrist

## Product Overview

The assistant is designed as a premium, professional admissions and student-enquiry interface for ZubeVision Tech Academy. It gives users a clean chat experience while keeping the underlying system simple to run, extend, and deploy.

Core capabilities:

- Answer academy-related questions using the local knowledge base.
- Provide cleanly formatted responses for courses, fees, schedules, and registration details.
- Capture prospective student lead details through the backend service layer.
- Notify the academy owner or instructor about new leads through Make.
- Present a polished ZubeVision-branded frontend experience.
- Provide an embeddable chat widget for external websites.
- Keep implementation notes in `implementation.md` for easy project continuation.

## Project Structure

```text
backend/          FastAPI backend API
frontend/         Next.js frontend chat interface
knowledge_base/   Markdown knowledge source for academy information
implementation.md Project history, decisions, fixes, and continuation notes
```

## Technology Stack

Backend:

- Python 3.11
- FastAPI
- Uvicorn
- Supabase
- Make webhook automation
- OpenRouter
- python-dotenv
- Pydantic

Frontend:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4

## Local Ports

The app uses custom local ports because common defaults are already reserved for other technologies on the development machine.

- Frontend: `http://localhost:3003`
- Backend: `http://127.0.0.1:8003`

## Getting Started

### 1. Backend Setup

From the project root:

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
python run.py
```

The backend runs at:

```text
http://127.0.0.1:8003
```

Health check:

```text
http://127.0.0.1:8003/health
```

### 2. Frontend Setup

From the project root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:3003
```

## Environment Configuration

Environment files are intentionally ignored and should not be committed.

Backend environment file:

```text
backend/.env
```

Expected backend keys:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MAKE_WEBHOOK_URL=
FRONTEND_URL=http://localhost:3003
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8003
```

`MAKE_WEBHOOK_URL` should be the custom webhook URL from the Make scenario.
When a complete lead is saved, the backend sends Make these fields:
`full_name`, `email`, `phone`, `course_of_interest`, `message`, and `source`.
The lead's `notification_sent` value is changed to `true` only after Make
accepts the webhook request. Repeated submissions with the same name, email,
phone, and course reuse the existing lead so they do not send duplicate emails.

## Lead Notification Automation

The lead automation follows this flow:

```text
Student submits complete details in chat
             |
             v
Backend checks for an existing matching lead
             |
             v
Backend saves a new lead in Supabase when needed
             |
             v
Backend sends the lead to the Make custom webhook
             |
             v
Make sends the configured email notification
             |
             v
Backend marks notification_sent=true in Supabase
```

The Supabase `leads` table is expected to contain:

```text
id
full_name
email
phone
course
created_at
notification_sent
```

Make receives this JSON payload:

```json
{
  "full_name": "Test Student",
  "email": "test@example.com",
  "phone": "+234 801 234 5678",
  "course_of_interest": "Full-Stack AI Engineering",
  "message": "The student's original chat message",
  "source": "ZubeVision Tech Academy AI Assistant"
}
```

Automation behavior:

- A Make failure does not undo the Supabase save or break the chat response.
- Failed notifications remain `notification_sent=false`.
- A repeated matching submission retries a pending notification.
- A lead already marked `notification_sent=true` is not inserted or emailed again.
- Make is called only after Supabase has returned the saved lead.

### Testing The Automation

1. Start the Make scenario or click **Run once** while configuring it.
2. Restart the backend after changing `backend/.env`.
3. Submit all required lead details in one chat message:

```text
My name is Test Student. My email is test@example.com.
My phone is +234 801 234 5678.
I am interested in Full-Stack AI Engineering.
```

Confirm that:

- The chat responds normally.
- Supabase contains the lead with the correct details.
- `notification_sent` changes to `true`.
- Make records a successful scenario execution.
- The configured recipient receives the email.

Submitting the same details again should not create another lead or send another
email. Use a different email or phone number for another fresh end-to-end test.

Frontend environment file:

```text
frontend/.env.local
```

Expected frontend key:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8003
```

## Production Deployment

The frontend is designed for Vercel and the backend is designed for Render.
This repository is a monorepo, so each platform must use the correct project
directory.

### 1. Deploy The Backend To Render

The repository includes a root-level `render.yaml` Blueprint. It intentionally
runs from the repository root so the existing
`knowledge_base/knowledge_base.md` remains available to the backend. Do not
copy the knowledge base into `backend/`; maintaining two copies could cause
production answers to drift from local answers.

The Render start command is:

```text
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT
```

Render supplies `PORT` automatically. A Railway `Procfile` is not required.

Deployment steps:

1. Push `render.yaml` to GitHub.
2. Open the Render Blueprint creation page for this repository.
3. Set the prompted environment variables:

```env
OPENROUTER_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MAKE_WEBHOOK_URL=
FRONTEND_URL=http://localhost:3003
```

4. Apply the Blueprint and wait for the service to become live.
5. Confirm these URLs return successful responses:

```text
https://your-render-service.onrender.com/
https://your-render-service.onrender.com/health
```

The Blueprint pins Python 3.11, installs `backend/requirements.txt`, uses the
existing `/health` endpoint, and redeploys when backend or knowledge-base files
change.

### 2. Deploy The Frontend To Vercel

Import the same GitHub repository into Vercel and configure:

```text
Root Directory: frontend
Framework Preset: Next.js
```

Add this Vercel environment variable for the Production environment:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-render-service.onrender.com
```

Deploy the frontend. Preview deployments use changing Vercel origins, so the
backend's current single-origin CORS setting is intended for the final
production deployment.

After Vercel assigns the production URL, update the Render `FRONTEND_URL`
environment variable to that exact origin, without a trailing slash:

```env
FRONTEND_URL=https://your-vercel-project.vercel.app
```

Then redeploy the Render service so the backend CORS configuration uses the
final frontend origin.

### 3. Production Verification

1. Open the Vercel production URL and send a normal academy question.
2. Confirm the browser request to `/api/chat` succeeds.
3. Submit a complete test lead and confirm Supabase and Make behave as they do
   locally.
4. Load the production widget page:

```text
https://your-vercel-project.vercel.app/widget
```

5. Use the production widget script on external sites:

```html
<script
  src="https://your-vercel-project.vercel.app/chat-widget.js"
  data-client-id="zubevision-tech-academy"
  data-widget-url="https://your-vercel-project.vercel.app/widget"
  data-color="#00A8A8"
></script>
```

## Branding And UI

The frontend implements the ZubeVision visual identity:

- Deep Blue: `#0A2540`
- Teal: `#00A8A8`
- Electric Blue: `#3A86FF`
- Light Grey: `#F5F7FA`
- White: `#FFFFFF`
- Dark Grey: `#6B7280`

Typography:

- Headings prefer `Poppins` or `Montserrat`.
- Body text prefers `Inter`.
- Fonts use CSS stacks to avoid build-time dependency on remote Google Fonts.

Logo:

```text
frontend/public/zubevision-tech-academy-logo.jpeg
```

UI highlights:

- Premium two-column desktop layout
- Responsive mobile layout
- ZubeVision logo panel
- Learn / Build / Deploy brand tags
- Live assistant status
- Quick prompt buttons
- Clean assistant message formatting
- Branded chat bubbles

## Embeddable Chat Widget

The project includes a branded website widget that can be embedded into WordPress, plain HTML, React, PHP, Laravel, and similar websites.

Widget files:

```text
frontend/public/chat-widget.js
frontend/app/widget/page.tsx
frontend/components/WidgetChatInterface.tsx
```

Local widget page:

```text
http://localhost:3003/widget
```

Local widget script:

```text
http://localhost:3003/chat-widget.js
```

Basic embed snippet:

```html
<script
  src="http://localhost:3003/chat-widget.js"
  data-client-id="zubevision-tech-academy"
  data-widget-url="http://localhost:3003/widget"
  data-color="#00A8A8"
></script>
```

Optional attributes:

- `data-client-id`: identifies the site or client using the widget.
- `data-widget-url`: points to the hosted widget page.
- `data-color`: controls the floating button color.
- `data-width`: controls the desktop widget width, for example `390px`.
- `data-height`: controls the desktop widget height, for example `610px`.

Important local ports:

- The widget frontend runs on `3003`.
- The widget still talks to the backend through `NEXT_PUBLIC_BACKEND_URL=http://localhost:8003`.

## Verification

Frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

Backend checks:

```powershell
cd backend
..\.venv\Scripts\python.exe -m unittest discover -s tests -v
..\.venv\Scripts\python.exe -m compileall -q app tests
```

## Documentation

This repository intentionally uses one main README at the project root.

For project memory, decisions, fixes, challenges, and continuation notes, read:

```text
implementation.md
```

Before continuing major development, review `implementation.md` first.
