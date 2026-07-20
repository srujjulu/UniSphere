# UniSphere: An Integrated College Club Management and Community Engagement Portal

UniSphere is a centralized web portal designed to unify, manage, and digitize all college club operations. Rather than managing clubs independently via spreadsheets, Google Forms, and isolated chat groups, UniSphere brings students, club core leaders, faculty coordinators, and administrators together under a unified, role-based system.

---

## 1. Problem Statement & Objectives

Currently, college clubs manage their workflow using fragmented, manual tools:
*   **Information Silos**: Students lack a central source to browse available clubs, leading to low visibility.
*   **Manual Administration**: Sign-ups, member tracking, and approvals are managed via paper records or spreadsheets.
*   **Event Registrations**: Registrations are dispersed across Google Forms, making tracking and attendance verification difficult.
*   **Scattered Media**: Photo galleries, announcements, and posters are shared in temporary chat groups, which are easily lost.

**UniSphere** solves these problems by digitizing the entire club lifecycle: from discovery and registration, to event coordination, approvals, and system-wide analytics.

---

## 2. Key Modules & Functional Architecture

### A. Authentication & Authorization Module
*   **Secure Access**: Implements login, signup, and sign-out flows powered by JSON Web Tokens (JWT) and bcrypt hashing on the backend.
*   **Role-Based Routing**: Restricts views and controls depending on the authenticated role.

### B. Club Management Module
*   Maintains structured profiles including Club Name, Logo, Mission, Coordinator info, and Members roster.
*   Handles join request flows where students apply and Club Core members approve/reject requests.

### C. Event Management Module
*   Club Core members can create, update, or delete events (Event Name, Venue, Date, Time, Registration Limits).
*   Students register with a click, and coordinators verify registrations.

### D. Gallery & Announcements Modules
*   Centralizes media uploads (posters, event photographs) for viewer feeds.
*   Facilitates instant posting of notices, meeting updates, and event notifications.

### E. Sponsor & Analytics Modules
*   Displays club sponsors (Logos, Names) to manage industry partnerships.
*   Displays real-time visitor stats, including online user counts, total traffic, and popularity metrics.

---

## 3. User Roles & Permission Matrix

```text
Visitor (Without Login)
      │
      ▼
College Information & Club Details (Read Only)
      │
      ▼
Login / Sign Up Verified
      │
      ├── Student: Join clubs, Register for events, Edit profile, View media.
      │
      ├── Club Core: Manage club info, Create events, Approve/Reject requests, View stats.
      │
      ├── Faculty Coordinator: Monitor club events, Approve major proposals, Review reports.
      │
      └── Super Admin: Register new clubs, Create Core/Coordinator accounts, View full analytics.
```

---

## 4. Technical Stack

*   **Frontend**: React (v19), Vite, Tailwind CSS, Framer Motion, React Router.
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL.
*   **Authentication & Security**: JSON Web Tokens (JWT), bcrypt.

---

## 5. Future Enhancements

*   **AI Chatbot**: Intelligent assistant to query active events and recommend clubs.
*   **Online Payment Integration**: Direct gate for paid event registrations.
*   **QR Attendance**: Scannable ticket passes for registered student attendees.
*   **Automated Certificates**: Generate and email digital participation certificates upon event completion.
