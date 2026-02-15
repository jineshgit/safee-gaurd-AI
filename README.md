# Safeguard AI - Enterprise Agent Evaluation Platform

A full-stack Next.js application for evaluating and securing AI agents, featuring scenario-based testing, persona simulation, and comprehensive analytics.

## 🚀 Features

-   **AI Agent Evaluator**: Test your agents against varied scenarios.
-   **Scenario Management**: Create and manage custom test cases with specific risk policies.
-   **Persona Simulation**: Test how agents interact with different user personas (e.g., "Frustrated Customer", "Tech-Savvy").
-   **Analytics Dashboard**: Track compliance scores, pass/fail rates, and risk trends.
-   **Secure Authentication**: Integrated with Clerk for user management.
-   **Scalable Database**: Powered by Supabase (PostgreSQL).
-   **Modern UI**: Built with Tailwind CSS, Lucide Icons, and Next.js App Router.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS
-   **Backend**: Next.js API Routes (Serverless)
-   **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
-   **Auth**: Clerk
-   **Icons**: Lucide React

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file with the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# AI Configuration (if applicable)
GEMINI_API_KEY=...
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── scenarios/
│   │   ├── personas/
│   │   ├── agents/
│   │   └── evaluations/
│   ├── dashboard/        # Dashboard pages
│   └── layout.tsx        # Main layout
├── components/           # Reusable UI components
└── lib/
    ├── database.ts       # Supabase service layer
    └── supabase-client.ts # Supabase client
```

## 🚢 Deployment

1.  **Repository**: Push this folder to GitHub.
2.  **Vercel**: Import the repository on Vercel.
3.  **Environment**: Add the environment variables from `.env.local`.
4.  **Deploy**: Vercel will automatically build and deploy the Next.js app.

---

**Safeguard AI**
