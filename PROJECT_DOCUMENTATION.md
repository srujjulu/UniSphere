# 🌐 UniSphere — Comprehensive Project Documentation

## 📌 Executive Summary
**UniSphere** is a centralized, next-generation **University Club & Campus Life Management Platform**. Designed to unify students, club coordinators, faculty advisors, and university administrators into an interconnected ecosystem, UniSphere digitizes and streamlines club memberships, event approvals, attendance verification, volunteer hour auditing, real-time analytics, and automated certificate generation.

---

## 🏗️ Architectural Overview

UniSphere is designed with a modern decoupled client-server architecture:

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 UniSphere Frontend (Vite)              │
                  │  React 19 + Tailwind CSS + Framer Motion + Lucide      │
                  └──────────────┬─────────────────────────┬───────────────┘
                                 │ HTTP / REST             │ Client State & Offline Fallbacks
                                 ▼                         ▼
                  ┌───────────────────────────────┐ ┌───────────────────────┐
                  │      Express.js Backend       │ │ Local Storage / Mocks │
                  │  JWT Auth • RESTful Endpoints │ │  Dynamic Fallback     │
                  └──────────────┬────────────────┘ └───────────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │    MongoDB / Memory DB        │
                  │  Users, Clubs, Events, etc.   │
                  └───────────────────────────────┘
```

---

## 👥 Role-Based Access Control (RBAC) & Dedicated Dashboards

UniSphere enforces strict Role-Based Access Control across four primary tiers:

| Role | Target Persona | Key Capabilities & Features |
| :--- | :--- | :--- |
| 🎓 **Student** | Campus Students | • Event discovery & registrations<br>• Instant Digital Event Passes with QR codes<br>• Interactive QR Attendance Scanner<br>• Verified Certificate Locker (View/Download/Share PDF)<br>• Volunteer Hours Tracker & Badges<br>• Club Membership Applications & Portfolios |
| ⚡ **Core Team / Coordinator** | Club Leads & Organizers | • Club Events & Workshop Management<br>• Attendance Terminal (Branch-wise, Year-wise)<br>• Event QR Code Pass Generator<br>• Comprehensive Event Reports Submission (Budget, Outcomes, Photos)<br>• Influencer & Guest Speaker Management<br>• Volunteer Hours Verification & Approvals |
| 🧑‍🏫 **Faculty Advisor** | Faculty Coordinators / Dept Leads | • Event Approval / Rejection Workflow with comments<br>• Budget & Sponsorship Auditing<br>• Club Performance Reviews & KPI monitoring<br>• Automated PDF/Excel Reports & Analytics |
| 🛡️ **Administrator** | Dean / Campus Administration | • Full-system analytics (Club count, attendance metrics, student engagement)<br>• User Management (Role modifications, bans/activations)<br>• Universal Club Directory & Permissions<br>• System-wide Event Report & Log exports (ZIP / PDF / CSV) |

---

## 🧩 Core System Modules & Features

### 1. 🎟️ Event Management & Digital Passes
- **Live Discovery**: Filter events by category (Hackathons, Cultural, Blood Drives, Photo Walks, MUN/Debates, Parade Drills, Movie Promotions).
- **Digital Passes**: QR-coded tickets generated per student registration.
- **QR Attendance Terminal**: Live check-in scanner for club coordinators to mark student attendance instantly.
- **Branch & Year Attendance Breakdown**: Real-time statistical analysis showing participant turnout across CSE, ECE, MECH, etc.

### 2. 📊 Event Post-Activity Reports
- **Multi-step Report Submission**:
  - Event highlights & executive summary
  - Branch-wise attendance aggregation
  - Budget breakdown (Approved vs. Actual Spent)
  - Key outcomes, winners, and guest feedback
  - Photo gallery uploads
- **Approval Workflow**: Faculty & Admins review submitted reports, request modifications, or approve them for official university records.
- **Exporting**: Instant single-click PDF export formatted to official university letterhead standards.

### 3. 📜 Automated Certificate Engine
- **Tamper-Proof Certificates**: Unique verification IDs generated dynamically for event winners, participants, and volunteers.
- **High-Resolution Rendering**: Built with `jspdf` & `html2canvas` for crisp, vector-grade downloadable PDF certificates.
- **Verification Portal**: Scan QR or enter verification hash to validate credential authenticity.

### 4. 🤝 Volunteer Hours & Community Tracker
- **Impact Hours Tracking**: Logs hours spent on social drives, hackathon organizing, Blood donation campaigns, etc.
- **Badging & Levels**: Bronze, Silver, Gold, and Platinum volunteer badges.
- **Faculty Endorsement**: Verified badges linked directly to student academic portfolio.

### 5. 🏢 Dedicated Club Portals
- Custom landing pages for every university club (`/club/:clubId`)
- Core committee member showcase & contacts
- Club-specific photo galleries & highlights
- Exclusive club sign-in / registration workflows

---

## 💻 Tech Stack & Libraries

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + Vanilla CSS + Glassmorphism UI
- **Animations**: Framer Motion & Canvas Confetti
- **Icons**: Lucide React
- **Form Management**: React Hook Form + Zod Resolvers
- **Exporting & Utilities**: `jspdf`, `html2canvas`, `jszip`, `axios`

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens) + Role-based middleware
- **Data Persistence**: MongoDB with Mongoose (with in-memory fallback for local zero-dependency testing)

---

## 📁 Directory Structure

```plaintext
UniSphere/
├── backend/
│   ├── config/             # DB connection & seed data
│   ├── controllers/        # Auth, Club, Event, Certificate, EventReport controllers
│   ├── middleware/         # Auth verification & RBAC middlewares
│   ├── routes/             # RESTful API endpoints
│   └── server.js           # Express application entry point
├── src/
│   ├── assets/             # Brand logos & static assets
│   ├── components/
│   │   ├── auth/           # Login, Register, Role-protected routes, PIN Modals
│   │   ├── dashboard/      # Admin, Core, Faculty, Student dashboards & Event Modals
│   │   └── layout/         # Navigation, Sidebar, Footer, Role Headers
│   ├── context/            # AuthContext (state management & role switcher)
│   ├── pages/              # ClubPage, Dashboard, LoginPage, Member dashboards
│   ├── utils/              # PDF Generator, Download Manager, Mock Data, Search Index
│   ├── App.jsx             # React router configuration
│   └── main.jsx            # Application root
└── package.json            # Project manifest
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/srujjulu/UniSphere.git
   cd UniSphere
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies** (optional for standalone server):
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

- **Frontend Development Server**:
  ```bash
  npm run dev
  ```
  Access the web app at `http://localhost:5173` (or port specified in terminal).

- **Backend Express Server**:
  ```bash
  npm run server
  # Or with live reload:
  npm run server:dev
  ```
  API server runs on `http://localhost:5000`.

---

## 🔐 Demo Credentials (Quick Switch)

UniSphere features rapid role-switching for evaluation:

| Role | Username / Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Student** | `student@unisphere.edu` | `student123` | `/student-dashboard` |
| **Club Coordinator** | `core@unisphere.edu` | `core123` | `/core-dashboard` |
| **Faculty Advisor** | `faculty@unisphere.edu` | `faculty123` | `/faculty-dashboard` |
| **Administrator** | `admin@unisphere.edu` | `admin123` | `/admin-dashboard` |

---

## 📄 License & Ownership
Developed with ❤️ for collegiate clubs, student councils, and university campus administration.
All rights reserved © 2026 UniSphere Project Team.
