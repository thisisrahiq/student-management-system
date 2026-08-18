# Student Management System — Registry Module

A focused, production-grade web application modeling core academic registry workflows. Built using **Next.js 14+ (App Router)**, **PostgreSQL**, **Prisma ORM**, **Tailwind CSS**, and **DaisyUI**.

---

## 🚀 Live GitHub Repository
**URL:** [https://github.com/thisisrahiq/student-management-system](https://github.com/thisisrahiq/student-management-system)

---

## 📋 Core Workflows & Feature Intuition

### 1. Stakeholder Understanding (Registry Team Workflow)
- **Student Enrolment Directory**: Create student records with auto-generated, unique Student IDs (`SMS-2025-XXXX`). Track academic year, programme allocation, and enrolment status (`ENROLLED`, `DEFERRED`, `WITHDRAWN`, `COMPLETED`).
- **Fees & Payment Governance**: Assign tuition fee structures automatically based on enrolled Programme base fee. Record payment transactions with reference numbers and payment dates.
- **Assessment Management**: Staff create module assessments with strict submission deadlines.
- **Marksheet Governance**: Staff enter numeric grades (`0–100`), auto-calculate classifications, and manage result publication states.

### 2. Feature Intuition & Edge Case Handling
- **Overdue Fee Detection**: Dynamic real-time calculation of outstanding balance (`Assigned Fee - Total Paid`). Overdue accounts are automatically flagged with visual warnings and red badges.
- **Late Submission Tagging**: Automatic timestamp comparison against assessment deadlines. Submissions past the deadline are accepted but visually flagged with an audited **LATE** tag for staff review.
- **Result Confidentiality & Withheld Marks**: Per-result **Withheld** ↔ **Published** visibility toggle. Student views strictly filter `isPublished = true` at the database query level so unreleased marks are never exposed to students.
- **Automatic Grade Classification**:
  - `70–100`: **Distinction**
  - `60–69`: **Merit**
  - `40–59`: **Pass**
  - `0–39`: **Fail**

### 3. Role Separation
- Contextual top navbar role toggle: **Staff Portal** (`/staff`) ↔ **Student Self-Service Portal** (`/student`).

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | React Server Components, Server Actions |
| **Language** | TypeScript | End-to-end type safety |
| **Database** | PostgreSQL | Persistent relational database |
| **ORM** | Prisma ORM | Type generation, migrations, seed script execution |
| **Styling** | Tailwind CSS + DaisyUI | Glassmorphism, animations, accessible component tokens |
| **Validation** | Zod | Runtime contract validation on client and server |

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- Node.js 18.x or 20.x+
- PostgreSQL database server running locally or via cloud (e.g. Supabase / Neon / Docker)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/thisisrahiq/student-management-system.git
cd student-management-system/APP
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` inside `APP/`:
```bash
cp .env.example .env
```

Example `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/student_management_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Push Database Schema & Generate Prisma Client
```bash
npx prisma db push
```

### 5. Load Demo Seed Data
```bash
npx prisma db seed
```
*Seeded data includes 5 Students across 2 Programmes with varying statuses (`ENROLLED`, `DEFERRED`, `COMPLETED`), payment histories (Fully Paid, Partial/Overdue, Zero Paid), assessments (Open & Closed), submissions, and graded results (Published & Withheld).*

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 AI Usage & Transparency Report

### AI Tools Utilized
- **Antigravity Agentic AI Assistant** powered by **Gemini 3.6 Flash (High)** model.

### How AI Was Used During the Build
1. **Domain & Schema Architecture**: AI assisted in translating registry domain requirements into a relational PostgreSQL schema using Prisma ORM. This included establishing unique constraints (`@@unique([assessmentId, studentId])`), cascades, and foreign key relations between Students, Programmes, Fees, Payments, Assessments, Submissions, and Results.
2. **UI & Design System Development**: Designed an interactive, modern interface using Tailwind CSS and DaisyUI with glassmorphism, animated count-up metrics, progress bars for tuition tracking, custom animations, and countdown timers.
3. **Edge Case Implementation**: AI helped structure Server Actions with explicit logic for handling edge cases—such as overdue fee alerts, auto-calculated grade classifications, late submission flags, and database-level result confidentiality filtering (`isPublished = true`).
4. **Debugging & Refactoring**: AI assisted in diagnosing and resolving Next.js App Router RSC serialization rules (handling Prisma `Decimal` objects across Server/Client boundaries) and refining hydration/component states.

---

## 📁 Repository Structure & Documentation

Detailed architectural specifications are located in `Architecture Docs/`:
- `1. Assessment Requirements Analysis.md`
- `2. Application Features & Requirements.md`
- `3. User Roles & Permissions.md`
- `4. User Journey & Technical Flow.md`
- `5. System Architecture.md`
- `6. Database ERD & Relationship Design.md`
- `7. PostgreSQL Schema Planning.md`
- `8. Prisma Schema Design.md`
