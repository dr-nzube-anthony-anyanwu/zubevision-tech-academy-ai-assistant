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
- A local Python 3.11 virtual environment in `.venv/`

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
|   |   +-- knowledge_service.py
|   +-- database/
|   |   +-- supabase_client.py
|   +-- prompts/
|       +-- system_prompt.py
+-- .env
+-- requirements.txt
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

## Frontend

The frontend is a Next.js app in `frontend/`.

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

## Challenges And Fixes

- Python 3.13 appeared in the terminal because the project venv was not activated. Fixed by creating `.venv/` with Python 3.11 and documenting activation commands.
- Uvicorn showed port `8000` because direct `uvicorn app.main:app --reload` uses Uvicorn's default port. Fixed by adding `backend/run.py` and `BACKEND_PORT=8003`.
- `cd frontend` initially failed because the frontend folder did not exist yet. Later a Next.js frontend was added.
- Frontend initially used port `3000`. Fixed by pinning `npm run dev` and `npm start` to port `3003`.
- Assistant output showed raw Markdown. Fixed by adding simple response formatting in `ChatInterface.tsx`.
- Hydration mismatch appeared due to a browser-injected body attribute. Fixed with `suppressHydrationWarning`.
- `next/font/google` failed during build because the environment could not fetch Google Fonts. Fixed by using CSS font stacks.

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

## Where We Stopped

As of May 12, 2026:

- Backend structure is in place.
- Backend is configured for Python 3.11 and port `8003`.
- Frontend runs on port `3003`.
- Frontend points to backend at `http://localhost:8003`.
- Premium ZubeVision Tech Academy UI is implemented.
- Logo is in the app and displayed.
- Markdown-like AI outputs are formatted cleanly.
- Lint and build pass for frontend.

## Recommended Next Steps

- Expand `knowledge_base/knowledge_base.md` with the full academy course details, fees, schedules, FAQs, registration steps, refund rules, and contact details.
- Confirm the Supabase `leads` table schema matches `lead_service.py`.
- Add stronger backend validation and error handling for chat and lead capture.
- Add loading indicators beyond plain text, such as animated typing dots.
- Add a proper deployment plan for frontend and backend.
- Consider moving secrets out of local `.env` before sharing or committing the project.
