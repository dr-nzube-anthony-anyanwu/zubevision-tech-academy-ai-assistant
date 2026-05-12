# ZubeVision Tech Academy AI Assistant

ZubeVision Tech Academy AI Assistant is an AI-powered web assistant built to help prospective students get clear, structured answers about ZubeVision Tech Academy programs, fees, schedules, registration, payment information, and academy policies.

The project combines a FastAPI backend, a branded Next.js frontend, a markdown knowledge base, OpenRouter-powered AI responses, and Supabase-ready lead capture.

## Author

Built by **Dr. Anthony .N. Anyanwu**.

**Role:** AI Systems Architect & Engineer | Data Scientist | Optometrist

## Product Overview

The assistant is designed as a premium, professional admissions and student-enquiry interface for ZubeVision Tech Academy. It gives users a clean chat experience while keeping the underlying system simple to run, extend, and deploy.

Core capabilities:

- Answer academy-related questions using the local knowledge base.
- Provide cleanly formatted responses for courses, fees, schedules, and registration details.
- Capture prospective student lead details through the backend service layer.
- Present a polished ZubeVision-branded frontend experience.
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
FRONTEND_URL=http://localhost:3003
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8003
```

Frontend environment file:

```text
frontend/.env.local
```

Expected frontend key:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8003
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

## Verification

Frontend checks:

```powershell
cd frontend
npm run lint
npm run build
```

Backend syntax check:

```powershell
cd backend
..\.venv\Scripts\python.exe -m py_compile run.py app\config.py app\main.py
```

## Documentation

This repository intentionally uses one main README at the project root.

For project memory, decisions, fixes, challenges, and continuation notes, read:

```text
implementation.md
```

Before continuing major development, review `implementation.md` first.
