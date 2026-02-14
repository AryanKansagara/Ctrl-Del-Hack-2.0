# Product Requirements Document (PRD)
# **Remember Me — Alzheimer’s Patient Companion**

**Version:** 0.3 (Draft)  
**Last Updated:** February 14, 2025  
**Status:** Draft for Review

---

## 1. Executive Summary

**Remember Me** is a **web application** that helps people with Alzheimer’s or other memory-related conditions in several ways: **(1)** A **live video feed** continuously identifies people in view and shows who they are in real time—with optional **spoken feedback** (“This is Maria, your daughter”) so the user doesn’t have to read. **(2)** The app keeps a **last-conversation** summary per person so the user can recall what was discussed. **(3)** A **daily activity log** tracks what the person does, and **reminders** (e.g., “Time to take your medicine”) prompt them at the right times. **(4)** An **emergency button** initiates a call and shares the user’s location with designated contacts for quick help. **(5)** **Orientation** answers “Where am I?”, “What day is it?”, and “What time is it?” at any time. **(6)** **Calm mode**: a single “I feel confused” button triggers a **soft, reassuring voice** that tells them they’re safe, where they are (e.g., “You’re at home” or “You’re at the grocery store”), and who’s nearby (e.g., “Maria is nearby”) to help them feel at peace. Together, this reduces confusion and disorientation, supports routines and medication adherence, and adds a safety net.

---

## 2. Problem Statement

- People with Alzheimer’s often **forget who someone is** (family, friends, caregivers), leading to embarrassment, anxiety, and withdrawal.
- They may also **forget what was recently discussed** with that person, making follow-up conversations difficult and repetitive.
- They can **forget daily routines and medications**, leading to missed doses or confusion about what to do next.
- Caregivers and family members have to **re-explain relationships, recent topics, and schedules** repeatedly, which is emotionally draining and time-consuming.
- They often feel **disoriented**—unsure where they are, what day or time it is—which increases anxiety.
- In a **crisis** (fall, confusion, wandering), the person may be unable to call for help or share where they are.

---

## 3. Vision & Goals

**Vision:**  
A simple, dignified tool that gives the user a quick, private way to answer “Who is this?” and “What did we last talk about?” in the moment.

**Goals:**
- Reduce anxiety and embarrassment when the user doesn’t recognize someone (real-time identification + optional spoken feedback).
- Preserve and surface recent conversation context per person.
- Support daily routines and medication adherence through activity logging and reminders.
- Provide a one-tap emergency path that calls and shares location.
- **Ground the user** with clear answers to “Where am I?”, “What day is it?”, “What time is it?” and **location-based reassurance** (e.g., “You’re at home”) so they feel at peace.
- Offer **calm mode**: one-tap reassurance with a soft voice when they feel confused (“You’re safe. You’re at home. Maria is nearby.”).
- Keep the experience minimal and easy to use for someone with cognitive decline.
- Support both the person with Alzheimer’s and their caregivers/family in setup and daily use.

---

## 4. Target Users

| User Type | Description | Primary Needs |
|-----------|-------------|---------------|
| **Primary: Person with Alzheimer’s** | Early to mid-stage; can use a browser on computer or tablet with minimal support | Quick “who is this?” and “what did we talk about?” with minimal steps |
| **Secondary: Family / Caregiver** | Sets up and maintains profiles and conversations | Easy way to add people, photos, and conversation notes; optional reminders |
| **Tertiary: Professional caregiver** | Uses app on behalf of or alongside the patient | Same as family; may need multi-patient or role-based access later |

---

## 5. Core Features

### 5.1 Who Is This? (Live Video Face Recognition & Identification)

**Description:**  
The app shows a **live video feed** from the camera. As people appear in frame, the app identifies them **in real time** and overlays their name and relationship on the video. Optionally, it **speaks out** who the person is (e.g., “This is Maria, your daughter”) so the user gets audio feedback without having to read.

**Requirements:**
- **Input:**  
  - **Live video stream** from the browser camera (primary). Face detection and recognition run continuously on the stream.  
  - Optional fallback: single photo upload for “Who is this?” when camera isn’t in use.
- **Real-time output:**  
  - Video feed with **on-screen labels** (e.g., name, relationship) near each recognized face.  
  - Labels update as people move or new faces enter the frame.
- **Spoken feedback (text-to-speech):**  
  - When a **new** person is recognized in the feed, the app can speak: “This is [Name], [relationship]” (e.g., “This is Maria, your daughter”).  
  - User or caregiver can turn voice on/off; optional “speak once per person per session” to avoid repetition.
- **Recognition:**  
  - Only people **registered** in the app are identified; unknown faces show “I don’t recognize this person” or no label.  
  - Clear, minimal UI so the user isn’t overwhelmed.
- **Privacy:**  
  - Video and face processing preferably in-browser or under user control; no use of stream for advertising or third parties.

**User flow (high level):**
1. Open app → start “Who is this?” / live view (camera turns on).  
2. Point device at people; video shows live with labels over each recognized face.  
3. Optionally hear: “This is Maria, your daughter” when she is first recognized.  
4. Tap a face/label to see “Last conversation” (links to 5.2).

---

### 5.2 What Did We Talk About? (Conversation Memory)

**Description:**  
For each recognized person, the app keeps a simple “last conversation” (and optionally a short history) so the user can quickly recall what was discussed.

**Requirements:**
- **Per-person memory:**  
  - Each contact has a “Last conversation” summary (and optionally 2–3 previous ones).  
- **How it’s captured:**  
  - **V1 (MVP):** Caregiver or user manually logs: “We talked about: [text]” after a visit/call.  
  - **Future:** Optional voice note or auto-summary (e.g., after a call) if technically feasible.  
- **Display:**  
  - When user taps a recognized person in the live view (or “Who is this?” result) and selects “See last conversation,” show:  
    - Date of last conversation.  
    - Short summary (e.g., “You talked about the garden, doctor’s appointment on Tuesday, and lunch with Sarah.”).  
- **Editable:**  
  - Family/caregiver can add or edit conversation notes anytime.

**User flow (high level):**
1. From “Who is this?” result, click “See last conversation.”  
2. See date + summary.  
3. Option to go back or open full profile.

---

### 5.3 People & Profiles (Setup by Caregiver / Family)

**Description:**  
Caregivers or family build and maintain the set of people the app can recognize and the context shown for each.

**Requirements:**
- **Add a person:**  
  - Name, relationship, optional “About” note.  
  - One or more **photos of the face** (clear, front-facing preferred) for recognition.  
- **Edit / remove:**  
  - Update name, relationship, photos, or delete person.  
- **Conversation log:**  
  - Add or edit “Last conversation” (and optionally older) entries per person.  
- **Access control:**  
  - V1: Single account/family; optional login or PIN so only designated people can edit.  
  - Future: Multiple caregivers, roles (view vs edit).

---

### 5.4 Daily Activity Log

**Description:**  
A simple **daily log** of activities the person does (e.g., morning walk, lunch, exercises, visitors). Helps the user and caregiver see what’s been done and what might be coming next; can also inform reminder logic.

**Requirements:**
- **Log entries:**  
  - Caregiver or user can add activities with optional time (e.g., “Took medicine – 9:00 AM”, “Had lunch”, “Maria visited”).  
  - Simple list or timeline view per day.
- **View:**  
  - “Today” view by default; optional past days so the user can recall “What did I do yesterday?”
- **Editable:**  
  - Add, edit, or remove entries; caregiver typically maintains the log.
- **Optional:**  
  - Link to reminders (e.g., “Medicine” reminder can auto-log “Took medicine” when user dismisses).

**User flow (high level):**
1. Open “Daily log” or “Today”.  
2. See list of activities for today (and optionally mark “Done”).  
3. Caregiver adds/edits entries from their view.

---

### 5.5 Reminders (e.g., Medicine, Activities)

**Description:**  
The app **reminds** the user at set times (e.g., “Now it’s time to take your medicine”) so they don’t miss medications or important daily activities.

**Requirements:**
- **Reminder types:**  
  - One-time or **repeating** (daily, specific days).  
  - Examples: “Take morning medicine”, “Take evening medicine”, “Doctor appointment at 2 PM”, “Lunch time”.
- **Delivery:**  
  - **In-app:** Prominent on-screen alert/notification when the user has the app open (e.g., banner or modal: “Time to take your medicine”).  
  - **Browser notifications:** Optional push/notification so the user is reminded even if the tab is in background (with permission).  
  - Optional sound or spoken reminder (“It’s time to take your medicine”).
- **Setup:**  
  - Caregiver creates and edits reminders (time, label, repeat rule).  
  - Simple list: “9:00 AM – Morning medicine”, “8:00 PM – Evening medicine”.
- **Dismissal:**  
  - User can dismiss/snooze; optional “Mark as done” that can feed into the daily activity log.

**User flow (high level):**
1. At scheduled time, app shows: “Now it’s time to take your medicine” (and optionally speaks it).  
2. User dismisses or marks done.  
3. Caregiver manages reminder schedule in settings.

---

### 5.6 Emergency Button (Call + Share Location)

**Description:**  
A highly visible **emergency button** that, when pressed, **calls** a designated contact (or emergency services) and **shares the user’s current location** so help can be sent quickly.

**Requirements:**
- **Button:**  
  - Always easy to find (e.g., persistent on screen or one tap from home).  
  - Large, clear label (e.g., “Emergency” or “Call for help”); distinct color (e.g., red).
- **On press:**  
  1. **Call:** Initiate a phone call to a **configured emergency contact** (e.g., family member, caregiver).  
     - Web limitation: use `tel:` link so the browser/device places the call (user may need to confirm “Call” on the device).  
     - Optional: support multiple contacts (e.g., call first contact, or show list “Call Mom / Call 911”).  
  2. **Share location:** Send the user’s **current location** (GPS coordinates and/or map link) to the same contact.  
     - E.g., open default messaging/email with pre-filled text: “I need help. My location: [link to map]” or send via in-app if backend supports SMS/email.  
     - Location obtained via browser Geolocation API (with user permission).
- **Setup:**  
  - Caregiver configures one or more emergency contact phone numbers and preferred way to share location (SMS, email, or in-app).
- **Privacy & consent:**  
  - User (or guardian) must consent to location sharing and understand when it’s used.

**User flow (high level):**
1. User taps “Emergency” / “Call for help”.  
2. App requests location (if not already available).  
3. App opens phone dialer with emergency contact pre-filled (user taps “Call” to connect).  
4. App opens share flow (e.g., SMS/email) with message containing current location link; user sends to contact.  
   - *Alternative:* Backend sends SMS/email automatically if backend + credentials are configured.

---

### 5.7 Orientation: Where Am I? What Day Is It? What Time Is It?

**Description:**  
The user can always get quick, clear answers to **orientation** questions: where they are, what day it is, and what time it is. This helps reduce disorientation and anxiety.

**Requirements:**
- **What time is it?**  
  - Show current **time** (and optionally date) clearly on screen; optional **spoken** answer (“It’s 3 o’clock in the afternoon”).
- **What day is it?**  
  - Show current **date and day of week** (e.g., “Saturday, February 14, 2025”); optional spoken answer (“Today is Saturday, February 14th”).
- **Where am I?**  
  - Use **location** (with permission) to tell the user their **place** in friendly language.  
  - **Location-based labels:** Caregiver can define **saved places** (e.g., “Home”, “Grocery store”, “Doctor’s office”) with an address or area. The app matches current GPS to the nearest saved place and says, e.g., “You’re at home” or “You’re at the grocery store.”  
  - If no saved place matches, use a simple fallback (e.g., “You’re at [street name]” from reverse geocoding, or “You’re at a familiar place”).
- **Always available:**  
  - One-tap or one-click access from the main screen (e.g., “What time is it?”, “What day is it?”, “Where am I?”) or a single **“Orientation”** panel that shows time, date, and place together.
- **Spoken option:**  
  - User can hear the answers read out (TTS) for any of the three.

**User flow (high level):**
1. User taps “What time is it?” / “What day is it?” / “Where am I?” (or opens “Orientation”).  
2. App shows and optionally speaks: current time, today’s date, and current place (e.g., “You’re at home”).

---

### 5.8 Calm Mode: “I Feel Confused” + Reassurance

**Description:**  
When the user feels confused or anxious, they tap a **“I feel confused”** (or “Calm mode”) button. The app responds with a **soft, reassuring voice** that tells them they’re safe, where they are, and who’s nearby (if known), to help them feel at peace.

**Requirements:**
- **Button:**  
  - Prominent, easy to find (e.g., “I feel confused” or “I need reassurance” or “Calm mode”).  
  - Calm, non-alarming wording and color (e.g., soft blue or green).
- **Response (spoken):**  
  - **Soft, calm tone:** Use a gentle TTS voice and pace (e.g., slower rate, warm voice option).  
  - **Content (personalized):** The reassurance message may be **AI-generated** (via OpenRouter; model TBD, e.g. Gemini—chosen based on OpenRouter’s free tier) so phrasing stays natural and varied. The system supplies the AI with: (1) reassurance intent (“you’re safe”), (2) current place (from 5.7), and (3) who’s nearby (from live video or “with you today”). The AI returns a short, calming sentence or two. If the AI is unavailable, use a fixed template.  
  - **Required elements** (whether AI or template): reassurance (“You’re safe”), place (e.g. “You’re at home”), and optionally who’s nearby (e.g. “Maria is nearby”).  
  - Example: *“You’re safe. You’re at home. Maria is nearby.”*
- **On-screen:**  
  - Show the same message in text so the user can read along or re-read; keep the screen simple and calming (e.g., minimal UI, soft background).
- **Setup:**  
  - Caregiver can optionally set “Who’s with you today” or rely on live recognition; saved places (Home, Grocery store, etc.) are configured by caregiver (same as 5.7).

**User flow (high level):**
1. User taps “I feel confused” / “Calm mode”.  
2. App gets current location and (if available) who’s in view or who’s marked as nearby.  
3. App speaks in a soft voice: “You’re safe. You’re at home. Maria is nearby.” (or equivalent).  
4. Same message is shown on screen; user can tap to hear again if needed.

---

## 6. User Stories (Summary)

**As a person with Alzheimer’s, I want to:**
- See a live video where people are labeled in real time so I know who is who without asking.  
- Hear the app say who someone is when they appear (“This is Maria, your daughter”).  
- See what we last talked about so I can continue the conversation naturally.  
- Be reminded when it’s time to take my medicine or do something important.  
- Have one obvious button to call for help and share where I am in an emergency.  
- **Ask “Where am I?”, “What day is it?”, “What time is it?”** and get a clear, spoken answer so I feel oriented.  
- **Tap “I feel confused”** and hear a calm voice tell me I’m safe, where I am, and who’s nearby so I can feel at peace.  
- Use the app with minimal steps and large, clear text in my browser.

**As a family member or caregiver, I want to:**
- Add people with their photo and relationship so the app can identify them in the live feed.  
- **Define places** (Home, Grocery store, etc.) so the app can tell my loved one “You’re at home” or “You’re at the grocery store.”  
- Log or update “last conversation” and daily activities.  
- Set up reminders (medications, appointments) for my loved one.  
- Be the emergency contact and receive their location when they press the emergency button.  
- Be sure the app is private and the data is in our control.

---

## 7. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Usability** | Large click/tap targets, simple navigation; live video + labels easy to understand; emergency and “I feel confused” always visible; orientation (time/day/place) one tap away. |
| **Accessibility** | High contrast, scalable text; **text-to-speech** for recognition, orientation, and calm mode; **soft, calm voice** for reassurance; keyboard-friendly where possible. |
| **Performance** | Real-time face recognition on video stream (smooth, low-latency labels); reminders trigger on time; works in modern browsers. |
| **Privacy & security** | Data encrypted; optional local-only storage; no use of face data for advertising or third-party sharing. |
| **Compliance** | Consider HIPAA (if health data stored), GDPR/regional consent for biometric data. |

---

## 8. Out of Scope (V1 / MVP)

- Automatic recording or transcription of real-life conversations.  
- Recognizing strangers or public figures.  
- Full clinical or medical decision support.  
- Multi-patient or facility-wide deployment (can be later phase).  
- Integration with wearables or smart home in V1.

---

## 9. Success Metrics

- **Adoption:** Number of people added; use of live “Who is this?” view; reminders and daily log set up.  
- **Engagement:** Use of “See last conversation”; reminder dismissal / “done” rate; daily log entries.  
- **Safety:** Emergency button usage and successful location share / call completion.  
- **Outcomes:** User/caregiver surveys: reduced anxiety, fewer “Who are you?” moments, better medication adherence, less disorientation.  
- **Orientation & calm:** Use of “Where am I?” / “What day/time?” and “I feel confused” button; feedback that calm mode helped.  
- **Quality:** Real-time recognition accuracy and latency; TTS clarity (including calm voice); reminder delivery reliability; location-to-place matching accuracy.

---

## 10. Technical Considerations (High Level)

- **Face recognition:** In-browser or server-side face embedding + matching on **video frames** (continuous stream); optimize for real-time performance; prefer client-side where possible for privacy.  
- **Live video:** Browser MediaDevices/getUserMedia for camera stream; process frames at a set interval (e.g., 1–2 FPS for recognition) to balance responsiveness and CPU.  
- **Text-to-speech:** Use **ElevenLabs** as the primary TTS provider for “This is [Name], [relationship]”, orientation, calm mode, and reminders; **Web Speech API (SpeechSynthesis)** as fallback when ElevenLabs is unavailable (e.g. offline, API limit, or user preference). Respect user/caregiver setting to enable/disable.  
- **Reminders:** In-app timers + optional browser Notifications API; store schedule in backend or local storage.  
- **Emergency:** `tel:` for calling; Geolocation API for location; share via `mailto:`/SMS link or backend if available.  
- **Orientation & calm mode:** Same Geolocation for “Where am I?”; **saved places** (caregiver-defined name + address or radius) matched to current coordinates; reverse geocoding as fallback. TTS for time, date, place, and calm reassurance via ElevenLabs (primary) or Web Speech API (fallback); use a **soft, slower** voice/rate for calm mode.  
- **“Who’s nearby” in calm mode:** Use current live-video recognition (who’s in frame) and/or caregiver-set “with you today” flag per person.  
- **AI-generated reassurance:** The wording of calm-mode reassurance (and optionally orientation or other supportive copy) may be **generated by an AI model** so it stays natural and adaptable. Use **OpenRouter** as the API gateway; the specific model (e.g. **Gemini** or another) will be chosen later based on whichever is freely available on OpenRouter’s free tier. The prompt/context shall include the required facts (e.g. “You’re safe,” current place, who’s nearby); the model produces short, calming phrasing. Fallback: fixed template phrases if the AI is unavailable.  
- **Platform:** **Web application** — runs in modern browsers (Chrome, Firefox, Safari, Edge) on desktop, laptop, or tablet; responsive; camera and location require HTTPS and user permission.  
- **Data model:** People (name, relationship, about, photo set); Conversation (person_id, date, summary); **Activity** (date, time, description, optional link to reminder); **Reminder** (label, time, repeat_rule, enabled); **Emergency contact** (name, phone, optional email); **Saved place** (name, address or lat/lng + radius, e.g. “Home”, “Grocery store”); settings (e.g., local-only storage, PIN/login, TTS on/off, calm voice preference).

---

## 11. Tech Stack

The following technologies are recommended for building the Remember Me web application. Choices align with the technical considerations above and with maintainability and healthcare-appropriate security.

| Layer | Technology | Notes |
|-------|------------|--------|
| **Frontend** | **React** | UI framework; component-based, good ecosystem and accessibility support. |
| **Frontend routing** | **React Router** | Client-side routing for multi-screen flows (live view, orientation, settings, etc.). |
| **Backend / API** | **FastAPI** | REST API for data (people, conversations, activities, reminders, places, emergency contacts, settings); async support; automatic OpenAPI docs; easy to add auth and validation. |
| **Database** | **PostgreSQL** (or **SQLite** for V1 / single-user) | Persistent storage for profiles, conversations, activities, reminders, saved places, emergency contacts. Use an ORM (e.g. **SQLAlchemy**) with FastAPI. |
| **Face recognition** | **face-api.js** (browser) and/or **Python** (server) | **Client-side:** face-api.js for in-browser detection and recognition (privacy-friendly, works offline). **Server-side (optional):** FastAPI + Python lib (e.g. **face_recognition**, **deepface**, or **OpenCV**) if heavier models or central storage of embeddings is preferred. |
| **State management** | **React Context** or **Zustand** | Lightweight state for UI (e.g. TTS on/off, current reminder, orientation cache); server state via React Query or SWR for API data. |
| **Styling** | **Tailwind CSS** or **CSS Modules** | Consistent spacing, large touch targets, high contrast; easy to enforce accessibility (e.g. min tap size, focus states). |
| **Auth (caregiver)** | **PIN (hashed)** or **JWT** | Simple PIN stored hashed for caregiver edit access; or email/password with JWT. Patient-facing flows remain usable without login. |
| **TTS** | **ElevenLabs** (primary), **Web Speech API (SpeechSynthesis)** (fallback) | ElevenLabs for higher-quality, natural voice (recognition, orientation, calm mode, reminders); fallback to Web Speech API when offline, over quota, or if user prefers. |
| **AI (reassurance / supportive content)** | **OpenRouter** (model TBD, e.g. **Gemini**) | Generate calm-mode reassurance and optionally other supportive text via OpenRouter; model to be decided based on what is freely available on OpenRouter (e.g. Gemini). Backend (FastAPI) calls OpenRouter with context (place, who’s nearby); fallback to fixed template phrases if API unavailable. |
| **Geolocation & geocoding** | **Browser Geolocation API** + **reverse geocoding** | Location from device; resolve coordinates to place name via a geocoding API (e.g. **OpenStreetMap Nominatim**, or **Google Maps Geocoding** if already in use). |
| **Notifications** | **Web Push** (optional) or in-app only | Browser Notifications API for reminders when tab is in background; optional backend (e.g. FastAPI + web-push) for push subscription. |
| **Deployment** | **Frontend:** Vercel / Netlify; **Backend:** Railway / Render / Fly.io (or Docker) | Static/build output for React; FastAPI as a service; HTTPS required for camera and geolocation. |

*Specific versions (e.g. React 18+, FastAPI 0.100+) and any additional libraries (e.g. React Query, Axios) can be pinned in the project’s dependency files.*

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Misidentification | Only recognize pre-registered people; clear “I don’t recognize” and “Add person?” flows. |
| Privacy / biometric concerns | Transparent consent, local-first processing, no selling of data; camera and location only with permission. |
| Complexity for user | Caregiver does setup (people, reminders, emergency contact); primary UI stays minimal (live view, reminders, emergency button). |
| Stigma | Neutral name and positioning; optional “companion” or “memory aid” framing. |
| Emergency reliability | Clear copy that user may need to confirm “Call” and “Share”; optional backend to auto-send location SMS/email for faster response. |
| Location privacy | Location used for emergency, “Where am I?”, and calm mode only with consent; explain when it’s used; optional continuous use only if needed for place-based reassurance. |
| Calm mode wrong info | Use same saved-places and live recognition as elsewhere; allow caregiver to set “who’s with you today” so “Maria is nearby” is accurate when camera isn’t in use. |
| AI reassurance off-topic or inappropriate | Use a constrained prompt (reassurance + place + who’s nearby only); short max length; fallback to fixed template if API fails or output is rejected. |

---

## 13. Open Questions for Stakeholders

1. Browser support: which browsers and minimum versions to target?  
2. Who is allowed to add/edit people and conversations (only family vs also professional caregivers)?  
3. Is offline-only or in-browser-only mode a must-have for V1?  
4. Any specific compliance or institutional requirements (e.g., memory care facilities)?  

---

## 14. Next Steps

1. Validate PRD with caregivers and/or patient advocacy groups.  
2. Prioritize MVP: live video “Who is this?” + TTS + “Last conversation” + reminders + daily log + emergency button + **orientation (time/day/place)** + **calm mode (“I feel confused”)**.  
3. Design low-fidelity flows for primary user and caregiver (web UI), including live view, emergency, orientation, and calm mode.  
4. Spike on real-time face recognition on video (in-browser e.g. face-api.js or server-side; frame rate vs accuracy).  
5. Spike on TTS: ElevenLabs integration (primary) and Web Speech API fallback, including soft/slow voice for calm mode; browser Notifications for reminders; Geolocation + saved places + reverse geocoding for “Where am I?” and calm reassurance.  
6. Define V1 release timeline and success criteria.

---

*This PRD is a living document. Update as scope and feedback evolve.*
