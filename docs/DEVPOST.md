# Recall — Devpost Submission

Use the sections below to fill out your Devpost project page. Copy-paste and adjust as needed.

---

## Project name
**Recall**

---

## Tagline (short description, 1 line)
A gentle companion for people with Alzheimer's: see who's in front of you, recall your last conversation, and get calm reassurance with one tap.

---

## Inspiration

People with Alzheimer's often forget who someone is or what they just talked about, which leads to embarrassment and anxiety. Caregivers repeat the same explanations over and over. We wanted a single app that:

- **Answers “Who is this?”** in real time with the camera and face recognition.
- **Reminds them what they last talked about** with each person.
- **Keeps them calm** when they feel confused, with a real back-and-forth voice conversation instead of a one-way message.
- **Supports routines** with reminders and a one-tap emergency path (call + share location).

Recall is built to feel like a **digital companion**—simple, private, and always on their side.

---

## What it does

- **Identify** — Live camera feed with real-time face recognition. Point the device at someone and see their name and relationship. Tap a face to see “Last conversation” (what you talked about last time).
- **People** — Add people with a clear photo; the app learns their face and uses it for recognition. All data stays on your device.
- **Conversations** — Optional live listening: when you tap a recognized face, the app summarizes the recent room conversation (via Groq) into 1–2 lines and saves it as that person’s last conversation.
- **Reminders** — Add reminders (e.g. “Morning medicine” at 09:00) with in-app and browser notifications.
- **Emergency** — Add a primary contact; one tap to **Call** and **Share my location**.
- **Calm Mode (“I feel confused”)** — A button in the nav on every page starts a **voice conversation**: the app speaks a short reassurance (ElevenLabs or browser TTS), then **listens** to the user, then replies with a new reassuring message. It’s a real back-and-forth, not a fixed script—so it can respond to what they say and keep them grounded.

---

## How we built it

- **Frontend:** Vite, React, TypeScript, Tailwind CSS. Face recognition in the browser with **face-api.js** (models from jsDelivr). Web Speech API for live transcription and fallback TTS; optional **ElevenLabs** for calm, natural voice in Calm Mode.
- **Backend:** FastAPI, SQLite, SQLAlchemy, Pydantic. REST API for people, conversations, reminders, emergency contacts, and Calm Mode (reassurance + reply + TTS).
- **AI:** **Groq** for (1) summarizing live conversation into 1–2 lines and (2) generating the initial Calm Mode message and each reply in the “I feel confused” conversation. Fallback templates when the API is unavailable.
- **Calm Mode flow:** Initial reassurance (with optional location/nearby person) → user speaks → transcript sent to `/api/calm/reply` with conversation history → Groq returns a short reply → spoken line-by-line (ElevenLabs or Web Speech) → 2.5s delay to avoid hearing our own voice → listen again. Single reply per user turn (no double API calls), with a guard so we don’t process the same input twice.
- **Deployment:** Docker Compose for backend + frontend; can run locally or on a server. Camera and location work over `localhost`; CORS and HTTPS can be adjusted for production.

---

## Challenges we ran into

- **Echo / feedback loop:** The mic was picking up the app’s own voice (ElevenLabs), so the “user” transcript was our reply and the loop repeated. We fixed it by adding a **2.5 second delay** after we finish speaking before turning the mic back on.
- **Two voices at once:** React sometimes ran the state updater twice, so we were calling the reply API twice and playing two TTS streams. We moved the API call **outside** the `setConversation` updater and added a **single-call guard** (`replyingRef`) so only one reply runs per user message.
- **Cross-platform UI:** Fonts and layout looked different on Windows vs Mac. We added explicit fallbacks (e.g. Segoe UI) and kept the design system consistent so the app feels the same everywhere.

---

## Accomplishments we're proud of

- **Real conversation in Calm Mode** — Not a pre-written script: the app listens, sends what the user said to Groq, and speaks a new reply every time. It feels like talking to someone who’s there to reassure you.
- **Privacy-first** — Face descriptors and photos stay in a local SQLite DB; no cloud face storage. Camera and mic are opt-in and used only for the features the user enables.
- **Accessible and calm design** — Large tap targets, clear labels, soft colors, and a dedicated “I feel confused” entry point on every page so help is always one tap away.
- **Works offline for core flows** — Face recognition and UI work without the backend; Groq/ElevenLabs add smart conversation and voice when configured.

---

## What we learned

- Designing for cognitive decline means **fewer choices, bigger targets, and no technical error messages**—we always fall back to a safe, friendly message.
- **Timing matters** for voice UX: a short delay after TTS before starting the mic avoids the system talking to itself.
- Keeping **one source of truth** for “we’re processing a reply” (and not triggering it from inside React state updaters) prevented duplicate API calls and overlapping audio.

---

## Try it out

**Local run:**

1. **Backend:** `cd backend && python -m venv .venv && .venv\Scripts\activate` (or `source .venv/bin/activate` on Mac/Linux), `pip install -r requirements.txt`, `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
2. **Frontend:** `cd frontend && npm install && npm run dev`
3. Open **http://localhost:5173**, allow camera on **Identify**, and add a person under **People** with a clear front-facing photo. Then try **Identify** and **I feel confused** (Calm Mode).

**Optional:** Add `GROQ_API_KEY` and `ELEVENLABS_API_KEY` in `backend/.env` for live conversation summary and Calm Mode voice (see README).

**Docker:** From the project root, `docker compose up --build`. Backend: http://localhost:8000, frontend: http://localhost:5173.

---

## Built with

- **React** · **TypeScript** · **Vite** · **Tailwind CSS**
- **FastAPI** · **SQLite** · **SQLAlchemy** · **Pydantic**
- **face-api.js** (browser face detection & recognition)
- **Groq** (conversation summarization & Calm Mode dialogue)
- **ElevenLabs** (Calm Mode voice)
- **Web Speech API** (live transcription, fallback TTS)
- **Docker** · **Docker Compose**

---

## Screenshots / demo

*Add 2–4 screenshots: e.g. Home, Identify (camera + labels), People list, Calm Mode conversation, Emergency page. If you have a short demo video, add the link in the “Demo” or “Link” field on Devpost.*

---

## Team / credits

*Add your team name and members, and any credits (e.g. face-api.js, Groq, ElevenLabs).*
