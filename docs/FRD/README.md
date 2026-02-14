# Functional Requirements Documents (FRDs)
# Remember Me — Module-Specific FRDs

This folder contains the **Functional Requirements Documents** for the Remember Me web application. The FRD has been split into **8 module-specific documents**, each covering a distinct functional area. This structure allows engineering teams to work on individual modules independently while maintaining clear traceability to the Product Requirements Document (PRD).

---

## Source Documents

- **Product Requirements Document (PRD):** [../PRD.md](../PRD.md), Version 0.3
- **Original (full) FRD:** [../FRD.md](../FRD.md) (archived; see note in that file)

---

## Module FRDs

| Module | Name | File | Key Features |
|--------|------|------|--------------|
| **1** | **Live Face Recognition & Identification** | [FRD-Module1-LiveRecognition.md](FRD-Module1-LiveRecognition.md) | Live video stream, real-time face recognition, on-screen labels, optional TTS, photo upload fallback |
| **2** | **Conversation Memory** | [FRD-Module2-ConversationMemory.md](FRD-Module2-ConversationMemory.md) | Store and display "last conversation" per person; caregiver add/edit conversation entries |
| **3** | **People & Profiles Management** | [FRD-Module3-PeopleProfiles.md](FRD-Module3-PeopleProfiles.md) | Add/edit/delete persons; upload face photos; set relationship and "with you today" flag |
| **4** | **Daily Activity Log** | [FRD-Module4-ActivityLog.md](FRD-Module4-ActivityLog.md) | Log daily activities (description, optional time); view today and past days; optional link from reminder "done" |
| **5** | **Reminders** | [FRD-Module5-Reminders.md](FRD-Module5-Reminders.md) | Schedule and trigger reminders (medication, appointments); in-app alerts + browser notifications; dismiss/snooze/mark done |
| **6** | **Emergency Calling & Location Sharing** | [FRD-Module6-Emergency.md](FRD-Module6-Emergency.md) | Persistent emergency button; call emergency contact; share current location via SMS/email |
| **7** | **Orientation & Calm Mode** | [FRD-Module7-OrientationCalm.md](FRD-Module7-OrientationCalm.md) | Answer "What time/day/where am I?"; calm mode button with soft TTS reassurance (safe, place, who's nearby); AI-generated or template message |
| **8** | **Settings & Access Control** | [FRD-Module8-Settings.md](FRD-Module8-Settings.md) | PIN/login authentication; TTS preferences; manage saved places and emergency contacts; optional local-only storage |

---

## Structure of Each Module FRD

Each module FRD is standalone and includes:

1. **Introduction & Scope** — Purpose, reference docs, in-scope, out-of-scope
2. **Module Overview** — Brief description, key capabilities
3. **Actors and User Roles** — Patient, Caregiver, permissions for this module
4. **Functional Requirements** — Numbered FR-M.N (e.g., FR-1.1, FR-2.1); "The system shall…" statements with inputs, outputs, behaviors
5. **Validation Rules and Edge Cases** — Module-specific edge cases and expected behaviors
6. **Data Entities** — Entities used by this module; relationships
7. **User Flows** — Happy path and failure/alternative paths
8. **Non-Functional Mappings** — NFRs (usability, accessibility, performance, privacy, compliance) relevant to this module
9. **Assumptions and Constraints** — Module-specific assumptions and constraints
10. **Dependencies** — References to other modules
11. **Document History** — Version and date

---

## Requirement Numbering

- **FR-M.N format:** M = module number (1–8), N = requirement index within module
- Example: FR-1.1 (Module 1, requirement 1), FR-7.5 (Module 7, requirement 5)
- Numbering is consistent across all module FRDs for traceability

---

## Usage

- **For engineers:** Pick the module(s) you're implementing and read the corresponding FRD(s). Each FRD is self-contained and references related modules where dependencies exist.
- **For QA:** Each FRD contains testable requirements ("The system shall…"), validation rules, and user flows (happy + failure paths) for writing test cases.
- **For product/project management:** See [../PRD.md](../PRD.md) for business context, vision, and goals. FRDs focus on system behavior and technical requirements.

---

## Document Status

- **Version:** 1.0 (all module FRDs)
- **Last Updated:** February 14, 2025
- **Status:** Formal

---

*For questions or updates, refer to the PRD ([../PRD.md](../PRD.md)) or contact the product team.*
