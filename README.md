# Recall — MVP

**Recall** is an Alzheimer's companion web app: **camera → face recognition → name overlay**, plus **People**, **Conversations**, **Reminders**, and **Emergency** (call + share location).

## Stack

- **Backend:** FastAPI, SQLite, SQLAlchemy, Pydantic
- **Frontend:** Vite, React, TypeScript, Tailwind CSS, face-api.js
- **Face recognition:** face-api.js (browser); models loaded from jsDelivr (GitHub repo weights)

## Quick start

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Allow camera when prompted on **Identify**.

### Live conversation summary (optional)

On **Identify**, Recall uses the **Web Speech API** to listen to the room. When you **tap a recognized person’s face**, it sends the recent transcript to the backend, which uses **Groq** to summarize it into 1–2 lines and saves it as that person’s last conversation.

1. Set your Groq API key (get one at [console.groq.com](https://console.groq.com/)):
   - **Local:** copy `backend/.env.example` to `backend/.env` and set `GROQ_API_KEY=your-key`.
   - **Docker:** set `GROQ_API_KEY` in your environment or in `docker-compose.yml` under `backend` → `environment`.
2. Allow **microphone** when the browser asks on the Identify page.
3. Talk; then tap a face to summarize and save the conversation for that person.

---

## Docker (Windows, macOS, Linux)

Use Docker when you want the same setup everywhere (e.g. sharing with someone on Mac).

**Requirements:** [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (or Docker Desktop, which includes both).

From the project root:

```bash
docker compose up --build
```

- **Backend:** http://localhost:8000  
- **Frontend:** http://localhost:5173  
- **API docs:** http://localhost:8000/docs  

First run may take a few minutes to build images and install dependencies. Code changes in `backend/` and `frontend/` are picked up via mounted volumes (backend may need a restart for some changes).

**Useful commands:**

| Command | Description |
|--------|-------------|
| `docker compose up -d` | Run in the background |
| `docker compose down` | Stop and remove containers |
| `docker compose up --build` | Rebuild images and start |
| `docker compose logs -f frontend` | Stream frontend logs |

**Note:** Camera and location in the browser work against `localhost`; for HTTPS or a different host you may need to adjust CORS and/or serve over HTTPS.

---

### 3. First use

1. **People** → Add person (name, relationship, one clear front-facing photo). Recall computes a face descriptor for recognition.
2. **Identify** → Start camera; faces are labeled in real time. Tap a face to see **Last conversation**.
3. **Conversation** → From a recognized person, view or add a last conversation (date + summary).
4. **Reminders** → Add reminders (e.g. "Morning medicine" at 09:00).
5. **Emergency** → Add an emergency contact, then use **Call** and **Share my location**.
6. **Calm Mode** → The **I feel confused** button (in the nav on every page) plays a short spoken reassurance and shows it on screen. Tap again to stop. Uses Groq for the message (or a fixed fallback) and ElevenLabs for voice when configured, otherwise the browser’s speech.

## Security notes

- Camera and location are used only with user permission.
- Face descriptors and photos are stored in the local SQLite DB; no third-party sharing.
- Run behind HTTPS in production; CORS is set for `localhost:5173`.

## Optional: local face-api models

If the CDN fails (e.g. offline or network restrictions), copy the face-api.js weights from [GitHub weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) into `frontend/public/models/` (e.g. `tiny_face_detector_model-weights_manifest.json` and shards, `face_landmark_68_model-*`, `face_recognition_model-*`). Then in `frontend/src/faceRecognition.ts` set `MODEL_URL = "/models"`.

## API

- `GET/POST /api/people` — list / create
- `GET/PATCH/DELETE /api/people/{id}`
- `GET /api/people/for-recognition` — minimal list for recognition
- `GET/POST /api/conversations`, `GET /api/people/{id}/last-conversation`
- `GET/POST/PATCH/DELETE /api/reminders`
- `GET/POST/PATCH/DELETE /api/emergency-contacts`
- `POST /api/calm/reassurance` — body: `{ location?, nearby_person? }` → `{ message }`
- `POST /api/calm/speak` — body: `{ text }` → audio (or 503; then use Web Speech API)
- `GET /api/health`

Docs: **http://localhost:8000/docs** when the backend is running.
