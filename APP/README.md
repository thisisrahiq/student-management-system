# Student Management System — Registry Module

A focused, production-grade web application modeling the core academic registry workflows required for recruitment technical evaluation. Built using **Next.js 14+ (App Router)**, **PostgreSQL**, **Prisma ORM**, **Tailwind CSS**, and **DaisyUI**.

---

## 📋 Core Workflows Implemented

1. **Student Enrolment Workflow**:
   - Create student records with auto-generated, unique Student IDs (`SMS-2025-XXXX`).
   - Track academic year, programme allocation, and status (`Enrolled`, `Deferred`, `Withdrawn`, `Completed`).
   - Real-time search by Name, Student ID, or Programme; filter by Programme and Enrolment Status.

2. **Fees & Payments Workflow**:
   - Assign tuition fee structures automatically based on enrolled Programme.
   - Record payment transactions with reference numbers and payment dates.
   - Dynamic real-time calculation of outstanding balance (`Assigned Fee - Total Paid`).
   - Visual dashboard warning alerts and table badges for overdue accounts.

3. **Assessment Submission Workflow**:
   - Staff define module assessments with submission deadlines.
   - Students view open/closed assessments and upload PDF (`.pdf`) or Word (`.docx`) deliverables.
   - Enforces 1 active submission record per assessment; allows resubmission prior to deadline.
   - Automatic timestamp comparison against deadline with visual **LATE** audit tagging.

4. **Marksheet & Results Governance**:
   - Staff enter numeric grades (`0–100`) per submission.
   - Automated grade classification calculation:
     - `70–100`: **Distinction**
     - `60–69`: **Merit**
     - `40–59`: **Pass**
     - `0–39`: **Fail**
   - Per-result **Withheld** ↔ **Published** visibility toggle.
   - **Result Confidentiality Enforcement**: Student views strictly filter `isPublished = true` at the database query level. Withheld marks remain hidden until official release.

5. **Role Separation**:
   - Contextual top navbar switch: **Staff Portal** (`/staff`) ↔ **Student Self-Service Portal** (`/student`).

---

## 📁 Repository Structure & Architecture Documentation

Detailed architectural and technical specification documents are maintained inside `Architecture Docs/`:

- [1. Assessment Requirements Analysis.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/1.%20Assessment%20Requirements%20Analysis.md)
- [2. Application Features & Requirements.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/2.%20Application%20Features%20%26%20Requirements%20markdown%20file%20for%20this%20assesment.md)
- [3. User Roles & Permissions.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/3.%20User%20Roles%20%26%20Permissions.md)
- [4. User Journey & Technical Flow.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/4.%20User%20Journey%20%26%20Technical%20Flow.md)
- [5. System Architecture.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/5.%20System%20Architecture.md)
- [6. Database ERD & Relationship Design.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/6.%20Database%20ERD%20%26%20Relationship%20Design.md)
- [7. PostgreSQL Schema Planning.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/7.%20PostgreSQL%20Schema%20Planning.md)
- [8. Prisma Schema Design.md](file:///Users/rahiq-mac/Desktop/student-management-system/Architecture%20Docs/8.%20Prisma%20Schema%20Design.md)

---

## 🛠️ Technology Stack

| Layer | Technology | Selection Rationale |
|---|---|---|
| **Framework** | Next.js 14+ App Router | React Server Components, Server Actions, Route Handlers |
| **Language** | TypeScript | End-to-end type safety |
| **Database** | PostgreSQL | Real persistent relational database |
| **ORM** | Prisma ORM | Type generator, migrations, seed script execution |
| **Styling** | Tailwind CSS + DaisyUI | Utility CSS and accessible component tokens |
| **Validation** | Zod | Runtime contract validation on client and server |

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- Node.js 18.x or 20.x+
- PostgreSQL database server running locally or via cloud (e.g. Supabase / Neon / Docker)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/student-management-system.git
cd student-management-system
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and set your PostgreSQL connection string:
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
# or run migrations:
# npx prisma migrate dev --name init
```

### 5. Load Seed Demo Data
```bash
npx prisma db seed
# or npm run db:seed
```
*Seeded data includes 5 Students across 2 Programmes with varying statuses (`Enrolled`, `Deferred`, `Completed`), payment histories (Fully Paid, Partial/Overdue, Zero Paid), assessments (Open & Closed), submissions, and graded results (Published & Withheld).*

### 6. Run Business Logic Unit Tests
```bash
node scripts/run-test.js
```

### 7. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 AI Usage & Transparency Report

In accordance with recruitment assessment guidelines, AI assistance was utilized transparently throughout the design, planning, and execution phases.

### AI Tools Utilized
- **Antigravity Agentic AI Assistant** powered by **Gemini 3.6 Flash (High)** model.

### Key Tasks Where AI Assisted
1. **Architecture & Requirements Modeling**: Drafting complete technical specs (Docs 3–8) covering ERD relationships, sequence flows, PostgreSQL table constraints, and Prisma schema optimization.
2. **Prisma & Data Layer Engineering**: Defining `schema.prisma` relations, indexes (`@@index`), unique constraints (`@@unique([assessmentId, studentId])`), and writing the comprehensive seed script (`prisma/seed.ts`).
3. **Server Actions & Logic Implementation**: Building type-safe Next.js Server Actions for enrolment, payment transactions, file upload handling, and grade classification boundaries.
4. **UI Component Design**: Styling responsive Staff and Student dashboards with Tailwind CSS, glassmorphism cards, DaisyUI badges, and modal dialogs.
5. **Unit Test Suite Generation**: Writing automated test assertions (`scripts/run-test.js`) to verify Student ID formatting, grade classification boundary values (0, 39, 40, 59, 60, 69, 70, 100), and financial balance calculations.

### Manual Verification & Code Quality Oversight
- **Domain Verification**: Reviewed all financial formulas (`Outstanding = Assigned Fee - Total Paid`) to eliminate rounding discrepancies and prevent invalid payment states.
- **Security & Confidentiality Check**: Verified that student endpoints strictly enforce `isPublished = true` filtering at the server database query layer so unreleased marks are never transmitted over the network.
- **File Validation Audit**: Confirmed server-side file MIME type validation restricting uploads exclusively to `.pdf` and `.docx` formats.
- **Build & Execution Integrity**: Executed test suite (`17/17 PASSED`) and verified clean build output.
