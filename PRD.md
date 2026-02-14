# Product Requirements Document (PRD)
# **Remember Me — Alzheimer’s Patient Companion**

**Version:** 0.1 (Draft)  
**Last Updated:** February 14, 2025  
**Status:** Draft for Review

---

## 1. Executive Summary

**Remember Me** is a **web application** that helps people with Alzheimer’s or other memory-related conditions recognize faces and recall recent conversations. When the user shows someone via the browser’s camera or uploads a photo, the app identifies who the person is and surfaces a short summary of the last conversation with them, reducing confusion and supporting more natural, confident social interaction.

---

## 2. Problem Statement

- People with Alzheimer’s often **forget who someone is** (family, friends, caregivers), leading to embarrassment, anxiety, and withdrawal.
- They may also **forget what was recently discussed** with that person, making follow-up conversations difficult and repetitive.
- Caregivers and family members often have to **re-explain relationships and recent topics** repeatedly, which is emotionally draining and time-consuming.

---

## 3. Vision & Goals

**Vision:**  
A simple, dignified tool that gives the user a quick, private way to answer “Who is this?” and “What did we last talk about?” in the moment.

**Goals:**
- Reduce anxiety and embarrassment when the user doesn’t recognize someone.
- Preserve and surface recent conversation context per person.
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

### 5.1 Who Is This? (Face Recognition & Identification)

**Description:**  
User can show a person to the app (live camera or photo) and get an answer like: “This is **Maria — your daughter**” plus a short relationship note.

**Requirements:**
- **Input methods:**  
  - Live camera via browser (e.g., point device at person using device camera).  
  - Photo upload (choose file or drag-and-drop).
- **Output:**  
  - Display name and relationship (e.g., “Your daughter,” “Your neighbor John”).  
  - Optional short “About [Name]” note (e.g., “Lives in Boston, visits on Sundays”).
- **Recognition:**  
  - Works only for people who have been **registered** in the app (no random stranger identification).  
  - Clear fallback: “I don’t recognize this person” or “Add this person?” when unknown.
- **Privacy:**  
  - All face data and profiles stored under user/caregiver control; optional local-only mode.

**User flow (high level):**
1. Open app in browser → click “Who is this?” or camera button.  
2. Allow camera access and point at person, or upload a photo.  
3. App shows: “[Name] — [Relationship]. [Short note].”  
4. Option to “See last conversation” (links to 5.2).

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
  - When user asks “Who is this?” and selects “See last conversation,” show:  
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

## 6. User Stories (Summary)

**As a person with Alzheimer’s, I want to:**
- Show someone on the screen (camera or uploaded photo) and quickly see who they are and how I know them.  
- See what we last talked about so I can continue the conversation naturally.  
- Use the app with minimal steps and large, clear text in my browser.

**As a family member or caregiver, I want to:**
- Add people with their photo and relationship so the app can identify them.  
- Log or update “last conversation” after a visit or call.  
- Be sure the app is private and the data is in our control.

---

## 7. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| **Usability** | Large click/tap targets, simple navigation, minimal steps (e.g., 2–3 clicks to “Who is this?” result). |
| **Accessibility** | High contrast, scalable text, optional voice feedback (“This is Maria, your daughter”); keyboard-friendly where possible. |
| **Performance** | Recognition result within a few seconds; works in modern browsers; optional offline support if models run in-browser. |
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

- **Adoption:** Number of people added per user; number of “Who is this?” uses per week.  
- **Engagement:** Use of “See last conversation” after identification.  
- **Outcomes:** User/caregiver surveys: reduced anxiety, fewer repetitive “Who are you?” moments.  
- **Quality:** Recognition accuracy and “I don’t know this person” rate on registered faces.

---

## 10. Technical Considerations (High Level)

- **Face recognition:** In-browser or server-side face embedding + matching; prefer client-side where possible for privacy; optional cloud storage of encrypted profiles.  
- **Platform:** **Web application** — runs in modern browsers (Chrome, Firefox, Safari, Edge) on desktop, laptop, or tablet; responsive so it’s usable on larger tablets/small laptops.  
- **Data model:** People (name, relationship, about, photo set); Conversation (person_id, date, summary); optional settings (e.g., local-only storage, PIN/login).

---

## 11. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Misidentification | Only recognize pre-registered people; clear “I don’t recognize” and “Add person?” flows. |
| Privacy / biometric concerns | Transparent consent, local-first processing, no selling of data. |
| Complexity for user | Strict MVP: “Who is this?” + “Last conversation” only; caregiver does all setup. |
| Stigma | Neutral name and positioning; optional “companion” or “memory aid” framing. |

---

## 12. Open Questions for Stakeholders

1. Browser support: which browsers and minimum versions to target?  
2. Who is allowed to add/edit people and conversations (only family vs also professional caregivers)?  
3. Is offline-only or in-browser-only mode a must-have for V1?  
4. Any specific compliance or institutional requirements (e.g., memory care facilities)?  

---

## 13. Next Steps

1. Validate PRD with caregivers and/or patient advocacy groups.  
2. Prioritize MVP: “Who is this?” (camera + file upload) + “Last conversation” (manual log).  
3. Design low-fidelity flows for primary user and caregiver (web UI).  
4. Spike on face recognition for web (in-browser library e.g. face-api.js, or server-side API; accuracy on older faces).  
5. Define V1 release timeline and success criteria.

---

*This PRD is a living document. Update as scope and feedback evolve.*
