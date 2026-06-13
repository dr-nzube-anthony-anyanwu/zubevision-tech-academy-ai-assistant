# ZubeVision Tech Academy AI Assistant - Implementation Log

This file is the project memory. Read it before continuing work so the next session can pick up from the current state without rediscovering the same setup, fixes, and decisions.

## Project Author

This technology was built by **Dr. Anthony .N. Anyanwu**.

**Role:** AI Systems Architect & Engineer | Data Scientist | Optometrist

## Project Purpose

The project is an AI assistant for ZubeVision Tech Academy. It helps prospective students ask about available courses, fees, schedules, registration, payment information, and related academy details.

The product currently has:

- A FastAPI backend in `backend/`
- A Next.js frontend in `frontend/`
- A markdown knowledge base in `knowledge_base/knowledge_base.md`
- Supabase lead capture with Make email automation
- A local Python 3.11 virtual environment in `.venv/`
- One professional root `README.md` as the single public README for the repository

## Current Local Ports

These ports were chosen because `3000`, `3001`, `3002`, `8000`, `8001`, and `8002` are already used by other technologies on the machine.

- Frontend: `http://localhost:3003`
- Backend: `http://127.0.0.1:8003`

## Python Environment

The project is pinned to Python 3.11.

- `.python-version` contains `3.11`
- `.venv/` was created using:

```text
C:\Users\User\AppData\Local\Programs\Python\Python311\python.exe
```

From the project root, activate the venv:

```powershell
.\.venv\Scripts\Activate.ps1
```

From inside `backend`, activate it with:

```powershell
..\.venv\Scripts\Activate.ps1
```

If `python --version` still shows Python 3.13, the venv is not active in that terminal. Directly checking the venv interpreter should show Python 3.11:

```powershell
..\.venv\Scripts\python.exe --version
```

## Backend

Backend tree created:

```text
backend/
+-- app/
|   +-- main.py
|   +-- config.py
|   +-- models.py
|   +-- routes/
|   |   +-- chat.py
|   +-- services/
|   |   +-- ai_service.py
|   |   +-- lead_service.py
|   |   +-- notification_service.py
|   |   +-- knowledge_service.py
|   +-- database/
|   |   +-- supabase_client.py
|   +-- prompts/
|       +-- system_prompt.py
+-- .env
+-- requirements.txt
+-- tests/
|   +-- test_lead_service.py
|   +-- test_notification_service.py
+-- run.py
```

The backend uses:

- FastAPI
- Uvicorn
- httpx
- python-dotenv
- Supabase
- Pydantic
- email-validator

Backend config is read from `backend/.env`. Do not paste secret values into docs or chat. Required keys include:

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

Run backend from `backend/`:

```powershell
python run.py
```

Important note: running this command directly will default to port `8000` unless `--port` is provided:

```powershell
uvicorn app.main:app --reload
```

Use either:

```powershell
python run.py
```

or:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8003
```

## Supabase Lead Capture And Make Automation

The completed automation uses the existing backend service layer:

```text
Complete student details
        |
        v
lead_service.py extracts and checks the lead
        |
        v
Supabase stores or returns the matching lead
        |
        v
notification_service.py posts to Make
        |
        v
Make sends the instructor/admin email
        |
        v
Supabase notification_sent becomes true
```

Live Supabase schema verified on June 7, 2026:

```text
id
full_name
email
phone
course
created_at
notification_sent
```

Important implementation decisions:

- The database column remains `course`; the Make payload maps it to
  `course_of_interest`.
- The Make payload contains `full_name`, `email`, `phone`,
  `course_of_interest`, `message`, and `source`.
- `notification_sent` is explicitly `false` for a new lead.
- It changes to `true` only after Make returns a successful HTTP response.
- A Make timeout or HTTP failure does not fail the working chat or remove the
  saved lead.
- Matching name, email, phone, and course values reuse the existing lead.
- An existing lead with `notification_sent=false` retries the Make request.
- An existing lead with `notification_sent=true` does not generate another
  row or email.
- Name extraction stops at the next lead field so values such as
  `My email is...` are not included in `full_name`.

The webhook URL is stored only in `backend/.env`:

```env
MAKE_WEBHOOK_URL=https://hook.example.make.com/your-webhook-id
```

Do not commit the real webhook URL.

## Frontend

The frontend is a Next.js app in `frontend/`.

Documentation note: the old `frontend/README.md` was removed. The project now keeps one professional README at the repository root so GitHub displays the correct project overview on the main repo page.

Current scripts:

```json
{
  "dev": "next dev -p 3003",
  "build": "next build",
  "start": "next start -p 3003",
  "lint": "eslint"
}
```

Run frontend from `frontend/`:

```powershell
npm run dev
```

Open:

```text
http://localhost:3003
```

Frontend environment:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8003
```

## UI And Branding

The frontend was upgraded from the default scaffold to a premium branded assistant interface.

Implemented visual identity:

- Deep Blue: `#0A2540`
- Teal: `#00A8A8`
- Electric Blue: `#3A86FF`
- Light Grey: `#F5F7FA`
- White: `#FFFFFF`
- Dark Grey: `#6B7280`

Typography:

- Headings prefer `Poppins`, then `Montserrat`
- Body prefers `Inter`
- Fonts are implemented as CSS stacks instead of `next/font/google` because production build failed in the restricted environment when Next.js tried to fetch Google Fonts.

Logo:

- Source was provided by the user from OneDrive.
- Copied into `frontend/public/zubevision-tech-academy-logo.jpeg`
- Rendered with `next/image` inside `components/ChatInterface.tsx`

Current UI features:

- Desktop two-column premium layout
- Branded left academy panel
- Logo display
- Learn / Build / Deploy identity tags
- Live assistant status
- Quick prompt buttons
- Branded chat bubbles
- Mobile-friendly responsive layout
- Embeddable chat widget route and script for external websites

## Embeddable Widget

Widget files added:

```text
frontend/public/chat-widget.js
frontend/app/widget/page.tsx
frontend/components/WidgetChatInterface.tsx
```

Purpose:

- Add a floating branded chat button to external websites.
- Open a premium ZubeVision chat panel.
- Load the assistant inside an iframe from the Next.js widget route.
- Work on WordPress, plain HTML, React, PHP, Laravel, and similar sites.

Local widget URLs:

```text
http://localhost:3003/widget
http://localhost:3003/chat-widget.js
```

Embed snippet:

```html
<script
  src="http://localhost:3003/chat-widget.js"
  data-client-id="zubevision-tech-academy"
  data-widget-url="http://localhost:3003/widget"
  data-color="#00A8A8"
></script>
```

Port note: the provided example was corrected from the common `3000` default to the actual project frontend port `3003`. The widget chat still sends messages through the existing frontend API helper, which points to the backend through `NEXT_PUBLIC_BACKEND_URL=http://localhost:8003`.

## Markdown Response Formatting

AI responses originally displayed raw Markdown such as:

```text
**Full-Stack AI Engineering**
### Course Structure
- item
1. item
```

Fix implemented in `frontend/components/ChatInterface.tsx`:

- Bold text renders properly
- Headings render as headings
- Bullet lists render as lists
- Numbered lists render as lists

This was done without adding a Markdown dependency.

## Hydration Warning Fix

The browser showed a hydration warning caused by this injected body attribute:

```html
cz-shortcut-listen="true"
```

This was likely added by a browser extension before React hydration.

Fix implemented in `frontend/app/layout.tsx`:

```tsx
<body suppressHydrationWarning>{children}</body>
```

## Vercel And Render Deployment Preparation

Deployment configuration was prepared on June 13, 2026:

- Frontend target: Vercel
- Backend target: Render Free web service
- Source: the existing GitHub monorepo
- Vercel root directory: `frontend`
- Render configuration: root-level `render.yaml`

Railway was considered, but its trial had ended and required a paid upgrade.
The backend target was therefore changed to Render's Free web service on
June 13, 2026.

Knowledge-base decision:

- `knowledge_base/knowledge_base.md` remains the single canonical file.
- It was not copied into `backend/`, because duplicate copies could drift.
- Render deploys from the repository root, so the existing knowledge-service
  path works locally and in production.

Render commands:

```text
Build: pip install -r backend/requirements.txt
Start: uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT
Health check: /health
Python: 3.11.11
```

The Render Blueprint watches `backend/**`, `knowledge_base/**`,
`render.yaml`, and `.python-version`.

Render secret environment variables must be entered in the Dashboard:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MAKE_WEBHOOK_URL=
FRONTEND_URL=
```

No `Procfile` was added because `render.yaml` defines the build, start,
health-check, build-filter, and environment settings. Render provides `PORT`
automatically.

Render Free-plan behavior:

- The service spins down after 15 minutes without inbound traffic.
- The first request after sleeping can take about one minute.
- The service uses an ephemeral filesystem, which is acceptable because the
  knowledge base is committed to Git and persistent data is stored in
  Supabase.

Vercel settings:

```text
Root Directory: frontend
Framework Preset: Next.js
```

Required Vercel production environment variable:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-render-service.onrender.com
```

After Vercel assigns the final production URL, Render must use that exact
origin for CORS:

```env
FRONTEND_URL=https://your-vercel-project.vercel.app
```

The production widget will be served by Vercel at `/widget` and
`/chat-widget.js`.

## Challenges And Fixes

- Python 3.13 appeared in the terminal because the project venv was not activated. Fixed by creating `.venv/` with Python 3.11 and documenting activation commands.
- Uvicorn showed port `8000` because direct `uvicorn app.main:app --reload` uses Uvicorn's default port. Fixed by adding `backend/run.py` and `BACKEND_PORT=8003`.
- `cd frontend` initially failed because the frontend folder did not exist yet. Later a Next.js frontend was added.
- Frontend initially used port `3000`. Fixed by pinning `npm run dev` and `npm start` to port `3003`.
- Assistant output showed raw Markdown. Fixed by adding simple response formatting in `ChatInterface.tsx`.
- Hydration mismatch appeared due to a browser-injected body attribute. Fixed with `suppressHydrationWarning`.
- `next/font/google` failed during build because the environment could not fetch Google Fonts. Fixed by using CSS font stacks.
- Generic Make sample code targeted a nonexistent `backend/main.py` lead flow.
  The integration was instead added to the existing
  `backend/app/services/lead_service.py` service boundary.
- A webhook failure could have turned successful chats into HTTP 500 responses.
  The notification service now treats Make as a non-blocking follow-up after
  the lead is safely stored.
- The initial lead name pattern could capture text from the following email
  field. The parser was narrowed to stop at field and sentence boundaries.
- Deploying only `backend/` would exclude the root knowledge base. Render
  instead builds from the repository root with explicit build and Uvicorn
  start commands in `render.yaml`.
- Railway required a paid upgrade after its trial ended. The backend deployment
  was switched to Render's Free web service.

## Verification Done

Frontend verification passed:

```powershell
npm run lint
npm run build
```

Backend Python syntax was checked earlier with:

```powershell
..\.venv\Scripts\python.exe -m py_compile run.py app\config.py app\main.py
```

Make automation verification completed on June 7, 2026:

```powershell
cd backend
..\.venv\Scripts\python.exe -m unittest discover -s tests -v
..\.venv\Scripts\python.exe -m compileall -q app tests
```

Results:

- 10 focused backend tests passed.
- Make-compatible payload mapping passed.
- Successful notification status updates passed.
- Failed webhook pending-state behavior passed.
- Duplicate lead and duplicate email prevention passed.
- Pending notification retry behavior passed.
- Name extraction boundary tests passed.
- The user completed a live end-to-end test and confirmed that Supabase, Make,
  and email delivery work correctly.

Deployment preparation verification completed on June 13, 2026:

- All 10 backend unit tests passed.
- The backend imported successfully through the Render start-command path.
- The root knowledge base loaded successfully with 3,287 characters.
- Frontend lint passed.
- The Next.js production build passed.
- `git diff --check` found no whitespace errors.

## Where We Stopped

As of June 13, 2026:

- Backend structure is in place.
- Backend is configured for Python 3.11 and port `8003`.
- Frontend runs on port `3003`.
- Frontend points to backend at `http://localhost:8003`.
- Premium ZubeVision Tech Academy UI is implemented.
- Logo is in the app and displayed.
- Markdown-like AI outputs are formatted cleanly.
- Embeddable widget route and script are implemented with ZubeVision branding.
- Lint and build pass for frontend.
- Documentation has been consolidated into one root `README.md`; the frontend README was removed to avoid duplicate project docs.
- Complete leads are stored in Supabase and sent to Make for email notification.
- Duplicate matching leads do not create duplicate rows or emails.
- Failed Make notifications remain pending and can be retried.
- The Make automation was confirmed working in a live end-to-end user test.
- A root `render.yaml` is ready for the Render backend deployment.
- The backend continues using the root knowledge base without duplication.
- The README documents the Vercel frontend and Render backend deployment flow.
- The project is deployment-ready but has not yet been created on either
  hosting platform.

## Recommended Next Steps

- Create the backend from `render.yaml` in Render and enter the required secret
  environment variables.
- Import the repository into Vercel with `frontend` as the root directory.
- Set `NEXT_PUBLIC_BACKEND_URL` in Vercel, then update Render `FRONTEND_URL`
  with the final Vercel production origin.
- Complete production chat, lead-capture, Make, health-check, and widget tests.
- Expand `knowledge_base/knowledge_base.md` with the full academy course details, fees, schedules, FAQs, registration steps, refund rules, and contact details.
- Add stronger backend validation and error handling for chat and lead capture.
- Consider a scheduled retry process for pending rows where
  `notification_sent=false`, so retries do not depend on a repeated submission.
- Add loading indicators beyond plain text, such as animated typing dots.
- Consider moving secrets out of local `.env` before sharing or committing the project.
