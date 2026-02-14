# Product Requirements Document (PRD)
# **Remember Me — Alzheimer’s Patient Companion**

**Version:** 0.2 (Draft)  
**Last Updated:** February 14, 2025  
**Status:** Draft for Review

---

## 1. Executive Summary

**Remember Me** is a **web application** that helps people with Alzheimer’s or other memory-related conditions in several ways: **(1)** A **live video feed** continuously identifies people in view and shows who they are in real time—with optional **spoken feedback** (“This is Maria, your daughter”) so the user doesn’t have to read. **(2)** The app keeps a **last-conversation** summary per person so the user can recall what was discussed. **(3)** A **daily activity log** tracks what the person does, and **reminders** (e.g., “Time to take your medicine”) prompt them at the right times. **(4)** An **emergency button** initiates a call and shares the user’s location with designated contacts for quick help. Together, this reduces confusion, supports routines and medication adherence, and adds a safety net.

---

## 2. Problem Statement

- People with Alzheimer’s often **forget who someone is** (family, friends, caregivers), leading to embarrassment, anxiety, and withdrawal.
- They may also **forget what was recently discussed** with that person, making follow-up conversations difficult and repetitive.
- They can **forget daily routines and medications**, leading to missed doses or confusion about what to do next.
- Caregivers and family members have to **re-explain relationships, recent topics, and schedules** repeatedly, which is emotionally draining and time-consuming.
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

## 6. User Stories (Summary)

**As a person with Alzheimer’s, I want to:**
- See a live video where people are labeled in real time so I know who is who without asking.  
- Hear the app say who someone is when they appear (“This is Maria, your daughter”).  
- See what we last talked about so I can continue the conversation naturally.  
- Be reminded when it’s time to take my medicine or do something important.  
- Have one obvious button to call for help and share where I am in an emergency.  
- Use the app with minimal steps and large, clear text in my browser.

**As a family member or caregiver, I want to:**
- Add people with their photo and relationship so the app can identify them in the live feed.  
- Log or update “last conversation” and daily activities.  
- Set up reminders (medications, appointments) for my loved one.  
- Be the emergency contact and receive their location when they press the emergency button.  
- Be sure the app is private and the data is in our control.

---

## 7. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Usability** | Large click/tap targets, simple navigation; live video + labels easy to understand; emergency button always visible. |
| **Accessibility** | High contrast, scalable text; **text-to-speech** for “This is [Name]” when someone is recognized; keyboard-friendly where possible. |
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
- **Outcomes:** User/caregiver surveys: reduced anxiety, fewer “Who are you?” moments, better medication adherence.  
- **Quality:** Real-time recognition accuracy and latency; TTS clarity; reminder delivery reliability.

---

## 10. Technical Considerations (High Level)

- **Face recognition:** In-browser or server-side face embedding + matching on **video frames** (continuous stream); optimize for real-time performance; prefer client-side where possible for privacy.  
- **Live video:** Browser MediaDevices/getUserMedia for camera stream; process frames at a set interval (e.g., 1–2 FPS for recognition) to balance responsiveness and CPU.  
- **Text-to-speech:** Use Web Speech API (SpeechSynthesis) or similar for “This is [Name], [relationship]”; respect user/caregiver setting to enable/disable.  
- **Reminders:** In-app timers + optional browser Notifications API; store schedule in backend or local storage.  
- **Emergency:** `tel:` for calling; Geolocation API for location; share via `mailto:`/SMS link or backend if available.  
- **Platform:** **Web application** — runs in modern browsers (Chrome, Firefox, Safari, Edge) on desktop, laptop, or tablet; responsive; camera and location require HTTPS and user permission.  
- **Data model:** People (name, relationship, about, photo set); Conversation (person_id, date, summary); **Activity** (date, time, description, optional link to reminder); **Reminder** (label, time, repeat_rule, enabled); **Emergency contact** (name, phone, optional email); settings (e.g., local-only storage, PIN/login, TTS on/off).

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Misidentification | Only recognize pre-registered people; clear “I don’t recognize” and “Add person?” flows. |
| Privacy / biometric concerns | Transparent consent, local-first processing, no selling of data; camera and location only with permission. |
| Complexity for user | Caregiver does setup (people, reminders, emergency contact); primary UI stays minimal (live view, reminders, emergency button). |
| Stigma | Neutral name and positioning; optional “companion” or “memory aid” framing. |
| Emergency reliability | Clear copy that user may need to confirm “Call” and “Share”; optional backend to auto-send location SMS/email for faster response. |
| Location privacy | Location used only when user taps emergency; explain in consent; don’t track continuously. |

---

## 12. Open Questions for Stakeholders

1. Browser support: which browsers and minimum versions to target?  
2. Who is allowed to add/edit people and conversations (only family vs also professional caregivers)?  
3. Is offline-only or in-browser-only mode a must-have for V1?  
4. Any specific compliance or institutional requirements (e.g., memory care facilities)?  

---

## 13. Next Steps

1. Validate PRD with caregivers and/or patient advocacy groups.  
2. Prioritize MVP: live video “Who is this?” + TTS + “Last conversation” + reminders + daily log + emergency button.  
3. Design low-fidelity flows for primary user and caregiver (web UI), including live view and emergency flow.  
4. Spike on real-time face recognition on video (in-browser e.g. face-api.js or server-side; frame rate vs accuracy).  
5. Spike on Web Speech (TTS) and browser Notifications for reminders; Geolocation + `tel:` for emergency.  
5. Define V1 release timeline and success criteria.

---

*This PRD is a living document. Update as scope and feedback evolve.*
