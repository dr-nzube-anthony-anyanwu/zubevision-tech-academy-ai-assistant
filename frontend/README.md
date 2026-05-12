# ZubeVision Tech Academy AI Assistant - Frontend

This is the Next.js frontend for the ZubeVision Tech Academy AI Assistant. It provides a branded chat interface for prospective students to ask about courses, fees, schedules, registration, and payment information.

## Author

Built by **Dr. Anthony .N. Anyanwu**.

**Role:** AI Systems Architect & Engineer | Data Scientist | Optometrist

## Current Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Backend API: FastAPI at `http://localhost:8003`
- Frontend dev server: `http://localhost:3003`

## Running Locally

From the `frontend` folder:

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3003
```

The dev and production scripts are pinned to port `3003` because ports `3000`, `3001`, and `3002` are reserved for other projects.

## Environment

The frontend expects:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8003
```

This is stored in `.env.local`.

## Important Files

- `app/page.tsx` renders the main chat interface.
- `app/layout.tsx` defines the HTML shell and suppresses known browser-extension hydration noise on the body tag.
- `app/globals.css` contains the ZubeVision color and typography tokens.
- `components/ChatInterface.tsx` contains the chat UI, quick prompts, assistant message formatting, and API call flow.
- `lib/api.ts` sends chat requests to the backend.
- `public/zubevision-tech-academy-logo.jpeg` is the academy logo used in the UI.

## Visual Identity

The interface follows the ZubeVision visual identity:

- Deep Blue: `#0A2540`
- Teal: `#00A8A8`
- Electric Blue: `#3A86FF`
- Light Grey: `#F5F7FA`
- White: `#FFFFFF`
- Dark Grey: `#6B7280`

Typography uses a safe CSS stack that prefers `Poppins` or `Montserrat` for headings and `Inter` for body text when available on the machine.

## Verification

Use these checks after frontend changes:

```powershell
npm run lint
npm run build
```
