# Mini Job Queue Dashboard

A full-stack application for managing and tracking background jobs. This project features a React frontend and a Next.js API backend, backed by a PostgreSQL database managed via Prisma. 

It specifically demonstrates how to handle **concurrent user updates** safely in a distributed web environment.

## 📁 Project Structure

This repository is divided into two main parts:

- **/backend**: A Next.js (App Router) application serving RESTful API routes. It uses Prisma ORM to interact with a Neon PostgreSQL database and Zod for robust request validation.
- **/frontend**: A React application (built with Vite) that provides a real-time dashboard to view jobs, create new ones, and update their statuses.

---

## ⚠️ The Concurrency Problem

In a collaborative environment, multiple users (or automated workers) might access the dashboard simultaneously. Without proper safeguards, this leads to **race conditions**.

### Example Scenario
1. **User A** and **User B** both open the dashboard. They see a job currently in the `pending` state.
2. **User A** clicks "Run" to claim the job. The backend receives the request and updates the status to `running`.
3. A split second later, **User B** (who hasn't refreshed their page and still sees `pending`) clicks "Fail". 
4. **The Flaw**: Without concurrency control, the backend blindly accepts User B's request, overwriting User A's action. The job incorrectly transitions to `failed`.

---

## 💡 The Solution: Optimistic Concurrency Control

To prevent conflicting updates without relying on heavy architectures (like WebSockets or Redis locks), this project implements **Optimistic Concurrency Control (OCC)** using a `version` field.

### How it works:

1. **Database Schema**: The `Job` model in Prisma includes a `version` integer that defaults to `0`.
2. **Data Fetching**: When the frontend fetches jobs, it receives the current `version` of each job.
3. **Atomic Updates**: When a user attempts to update a job's status, the frontend sends the *expected* `version` along with the requested status change.
   ```json
   {
     "status": "running",
     "version": 0
   }
   ```
4. **Backend Validation**: The backend attempts to update the database using an atomic query:
   ```javascript
   await prisma.job.updateMany({
     where: { id: "job-123", version: 0 },
     data: { status: "running", version: { increment: 1 } }
   });
   ```
5. **Conflict Resolution**:
   - If the update succeeds (count > 0), the job's version becomes `1`.
   - When **User B** tries to send their stale request with `version: 0`, the `where` clause fails to find a match (because the database version is now `1`). 
   - The backend detects this and responds with a `409 Conflict`.
   - The frontend intercepts the `409 Conflict`, alerts User B that the job was modified by someone else, and automatically refreshes the dashboard to fetch the latest state.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Start the Backend
```bash
cd backend
npm install

# Ensure your .env is configured with a valid DATABASE_URL
# Push the schema to the database (if not already done)
npx prisma db push
npx prisma generate

# Start the Next.js API server (runs on port 3000/3001)
npm run dev
```

### 2. Start the Frontend
In a new terminal window:
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```

### 3. Test the Concurrency Setup
1. Open the frontend in **two separate browser tabs**.
2. Identify a `pending` job.
3. In **Tab A**, change the status to `running`.
4. Immediately go to **Tab B** (without refreshing) and try to change the status to `failed`.
5. You will see a conflict error message in Tab B, and the UI will auto-refresh to show that the job is actually `running`!

