# Functional Requirements Document (FRD)
# Module 1: Live Face Recognition & Identification

**Version:** 1.0  
**Source PRD:** [../PRD.md](../PRD.md) (Version 0.3)  
**Module:** 1 of 8  
**Last Updated:** February 14, 2025  
**Status:** Formal  
**Target audience:** Engineering, QA, and implementation teams.

---

## 1. Introduction & Scope

### 1.1 Purpose

This FRD covers **Module 1: Live Face Recognition & Identification** of the Remember Me application. It specifies the functional requirements for acquiring live video, detecting faces, recognizing registered persons in real time, displaying identification labels, providing optional text-to-speech feedback, and handling unrecognized faces or camera permission issues. This document uses "The system shall…" language for testable, implementation-ready requirements.

### 1.2 Reference Documents

- **Product Requirements Document (PRD):** [../PRD.md](../PRD.md), Version 0.3, Section 5.1.
- **Related FRDs:** 
  - Module 2: Conversation Memory (for "See last conversation" navigation)
  - Module 3: People & Profiles Management (for person registration and photo management)
  - Module 8: Settings & Access Control (for TTS enable/disable and "speak once per person")

### 1.3 In Scope

- Acquiring live video stream from browser camera
- Real-time face detection and recognition on video frames
- Displaying on-screen labels (name, relationship) for recognized persons
- Optional text-to-speech (TTS) on first recognition per session
- Single-photo upload as alternative/fallback to live video
- Handling unrecognized faces ("I don't recognize this person")
- Navigation to "Last conversation" from recognized person
- Privacy: face processing in-browser or under user control

### 1.4 Out of Scope

- **Person registration and profile management** (see Module 3)
- **Conversation memory storage and display** (see Module 2)
- **Camera permission UI** (delegated to browser; system responds to permission state)
- **TTS settings configuration** (see Module 8)
- Recognizing strangers or public figures (only registered persons)

---

## 2. Module Overview

This module enables the patient (and optionally the caregiver) to use the device camera to identify people in real time. The system captures a live video stream, runs face detection and recognition on individual frames, and overlays labels (name and relationship) on recognized faces. When TTS is enabled, the system speaks "This is [Name], [relationship]" the first time a person is recognized in a session. If the camera is unavailable or denied, the user can upload a single photo for identification. Unrecognized faces are clearly indicated. Users can tap on a recognized person's label to see the last conversation with them (Module 2).

**Key capabilities:**
- Live video with real-time face recognition
- Photo upload fallback
- On-screen identification labels
- Optional TTS on first recognition
- Privacy-focused (in-browser processing where possible)

---

## 3. Actors and User Roles (Module 1)

| Actor | Capabilities in Module 1 | Notes |
|-------|-------------------------|--------|
| **Patient** | Start live view, upload photo, view labels on video, hear TTS, tap label to navigate to conversation | Primary user of recognition feature |
| **Caregiver** | Same as Patient; may use live view for setup/verification | Can test recognition but primarily manages people in Module 3 |

**Permissions:** Both Patient and Caregiver can use all Module 1 features (FR-1.1–FR-1.7). No edit permissions required; recognition is read-only from the user's perspective (person data is managed in Module 3).

---

## 4. Functional Requirements

| ID | Requirement | Inputs | Outputs | Behavior / Notes |
|----|-------------|--------|--------|------------------|
| **FR-1.1** | The system shall acquire a live video stream from the device camera when the user starts the "Who is this?" / live view and camera permission is granted. | User action (start live view); browser camera permission. | Live video feed displayed in the application. | If camera permission is denied, see validation rules §5. |
| **FR-1.2** | The system shall run face detection and recognition on frames from the video stream at a defined interval and shall display on-screen labels (name, relationship) only for faces that match a registered person above a defined confidence threshold. | Video frames; registered persons (face embeddings and metadata). | Labeled video feed with name and relationship per recognized face. | Labels shall update as faces move or new faces enter the frame. Only registered persons shall be identified. |
| **FR-1.3** | The system shall support an optional single-photo upload as an alternative input for "Who is this?" when the camera is not in use or is denied. | User-selected image file. | Identification result screen (recognized person or "I don't recognize this person"). | Same recognition logic and registered-persons-only rule as live stream. |
| **FR-1.4** | The system shall display "I don't recognize this person" or an equivalent message (or no label) for any face that does not match a registered person above the confidence threshold. | Detected face; registered persons. | No identification or explicit "unrecognized" message. | The system shall not identify or label strangers or public figures. |
| **FR-1.5** | When text-to-speech (TTS) for recognition is enabled in settings, the system shall speak the phrase "This is [Name], [relationship]" when a person is first recognized in the current session, where Name and relationship are taken from the registered person's profile. | Recognized person id; TTS enabled; session state. | Audio output via ElevenLabs (primary) or Web Speech API (fallback). | If "speak once per person per session" is enabled, the system shall not speak again for the same person in that session. |
| **FR-1.6** | The system shall allow the user to navigate from a recognized person's label to the "Last conversation" view for that person (Module 2). | User tap/click on label or identified person. | Navigation to conversation memory display. | See Module 2 FR-2.2. |
| **FR-1.7** | The system shall not use the video stream or face data for advertising or share them with third parties; processing shall be in-browser or under user/caregiver control where technically feasible. | N/A | N/A | Privacy requirement; no behavioral output beyond system behavior. Face data used only for recognition within the app. |

---

## 5. Validation Rules and Edge Cases

| Case | Condition | Expected System Behavior |
|------|------------|--------------------------|
| **Camera permission denied** | User denies or revokes camera access. | The system shall display a clear message that camera access is required for live view and shall offer the option to use single-photo upload instead (FR-1.3). |
| **No face in frame** | Video frame contains no detectable face. | The system shall display the video without labels; no TTS shall be triggered. |
| **Face not recognized** | Detected face does not match any registered person above threshold. | The system shall show "I don't recognize this person" or equivalent, or no label (FR-1.4). Optionally offer "Add this person?" linking to Module 3 (People & Profiles). |
| **Multiple faces in frame** | Two or more faces in frame. | The system shall attempt to label each detected face independently; each recognized person shall receive a label; unrecognized faces shall be handled per above. |
| **Low confidence** | Match confidence below threshold. | Treat as unrecognized; do not display a name/relationship for that face. |
| **Photo upload invalid or corrupt** | User uploads an unreadable or unsupported image. | The system shall display an error message and allow the user to choose another image or cancel. |
| **TTS unavailable** | Browser does not support TTS or TTS fails. | The system shall still display labels; TTS is optional. No blocking of recognition flow. |
| **Session restart** | User closes and reopens the app, or session expires. | The "speak once per person per session" counter shall reset; each person may be announced again on first recognition in the new session. |

---

## 6. Data Entities (Module 1)

### 6.1 Entities Used

| Entity | Key attributes | Usage in Module 1 |
|--------|----------------|-------------------|
| **Person** | id, name, relationship, photo_set / face_embeddings | Retrieved for recognition matching; face embeddings compared against detected faces; name and relationship displayed as labels. |

### 6.2 Relationships

- **Person** is created and managed in Module 3 (People & Profiles).
- Module 1 reads Person data (embeddings, name, relationship) but does not modify it.
- No direct dependency on Conversation, Activity, Reminder, etc. in this module (other than navigation link to Conversation in FR-1.6).

---

## 7. User Flows

### 7.1 Live Face Recognition — Happy Path

1. **User opens the application** and selects "Who is this?" or starts live view.
2. **System requests camera permission**; user grants it.
3. **System displays live video feed** and begins face detection/recognition on frames (e.g., 1–2 FPS).
4. **One or more faces appear** in frame; system matches them to registered persons and displays **labels (name, relationship)** on the video.
5. **When a person is first recognized** in the session and TTS is enabled, system speaks **"This is [Name], [relationship]."**
6. **User taps a label**; system navigates to "Last conversation" for that person (Module 2, FR-2.2).

### 7.2 Live Face Recognition — Failure / Alternative Paths

- **Camera denied:** System displays message that camera is required for live view and offers **"Upload a photo instead."** User may upload a single photo; system runs recognition and shows result (recognized person or "I don't recognize this person").
- **No faces in frame:** Video continues without labels; no TTS.
- **All faces unrecognized:** Labels show "I don't recognize this person" (or no label); no TTS for identification.
- **Invalid photo upload:** System displays error and allows user to choose another image.
- **TTS fails:** Labels are still displayed; user does not hear announcement but can read on-screen.

---

## 8. Non-Functional Mappings

### 8.1 NFRs Relevant to Module 1

| NFR Area | Requirement | FR IDs |
|----------|-------------|---------|
| **Usability** | Large click/tap targets for labels; simple start of live view; clear camera permission messaging | FR-1.1, FR-1.3, FR-1.6 |
| **Accessibility** | TTS for recognition so user doesn't have to read labels; high contrast labels | FR-1.5 |
| **Performance** | Real-time face recognition with low-latency label updates; smooth video display; processing at defined interval (e.g. 1–2 FPS) | FR-1.2 |
| **Privacy & Security** | Face data not shared with third parties; in-browser processing preferred; camera with user consent | FR-1.1, FR-1.7 |
| **Compliance** | Biometric data (face) consent; recognition limited to registered persons only | FR-1.1–1.4, FR-1.7 |

### 8.2 Traceability

- **NFR-1 (Usability):** FR-1.1, FR-1.6
- **NFR-2 (Accessibility):** FR-1.5
- **NFR-3 (Performance):** FR-1.2
- **NFR-4 (Privacy & Security):** FR-1.1, FR-1.7
- **NFR-5 (Compliance):** FR-1.1–1.4, FR-1.7

---

## 9. Assumptions and Constraints

### 9.1 Assumptions

- The device has a camera and the browser supports `getUserMedia` (MediaDevices API).
- The application is served over HTTPS so camera access is available.
- User (or guardian) consents to camera use when prompted by the browser.
- Registered persons have been added by the caregiver in Module 3 (at least one photo per person).
- Face embeddings or recognition models are available (in-browser via face-api.js or server-side).
- TTS is provided by ElevenLabs (primary) or Web Speech API (fallback); availability depends on implementation and browser.

### 9.2 Constraints

- **Camera permission** is controlled by the browser; the system can only respond to granted/denied state.
- **Recognition accuracy** depends on photo quality, lighting, angle, and face embedding model; confidence threshold shall be tuned during implementation.
- **Real-time processing** is limited by device CPU; frame rate (e.g., 1–2 FPS) is a balance between responsiveness and performance.
- **Privacy:** Video stream shall not be recorded or transmitted to third parties; processing is in-browser or on a controlled backend.
- **Registered persons only:** The system shall not attempt to identify strangers, public figures, or any person not explicitly registered by the caregiver.

---

## 10. Dependencies

- **Module 3 (People & Profiles):** Person data (name, relationship, face embeddings) must be created before recognition can occur.
- **Module 2 (Conversation Memory):** Navigation from FR-1.6 links to Module 2's "See last conversation" (FR-2.2).
- **Module 8 (Settings):** TTS enable/disable and "speak once per person" settings control FR-1.5 behavior.

---

## Document History

| Version | Date | Author | Changes |
|--------|------|--------|---------|
| 1.0 | February 14, 2025 | — | Initial Module 1 FRD extracted from full FRD. |

---

*This FRD is for Module 1 only. For other modules, see the FRD/ folder. For business context, see [../PRD.md](../PRD.md).*
