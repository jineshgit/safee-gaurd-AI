# Safeguard AI - Enterprise Agent Evaluation

## Project Overview
Safeguard AI is a specialized tool designed to evaluate the behavioral compliance of AI agents. It ensures that enterprise AI agents adhere to strict company policies, maintain appropriate tone, and correctly handle escalation scenarios.

## Technical Architecture

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Hooks (`useState`, `useEffect`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (managed via Knex.js)
- **API Port**: 3001

## Key Features

### 1. Evaluator Dashboard
A centralized interface for testing and visualizing agent performance.

### 2. Scenario-Based Testing
Pre-configured scenarios covering critical risk types:
- **Authority Risk**: Ensuring agents don't make unauthorized commitments (e.g., refunds outside policy).
- **Policy Risk**: Verifying adherence to regulations (e.g., Medical advice, GDPR).
- **Escalation Risk**: Checking if agents correctly identify when to transfer to a human.

### 3. Real-Time Evaluation
The system analyzes agent responses against specific "Required Actions" and "Forbidden Actions" to generate a verdict on:
- **Policy Adherence** (PASS/FAIL)
- **Tone Analysis** (OK/NOT_OK)
- **Escalation Handling** (Correct/Missed)
- **Hallucination Check** (detected/none)

### 4. Hybrid Evaluation Engine
- **Backend Mode**: Connects to the local API for advanced processing and persona data.
- **Client-Side Fallback**: Includes a robust offline mode to perform basic evaluations directly in the browser if the backend is unavailable.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- `npm` or `yarn`

### 1. Backend Setup
The backend handles persona data and advanced evaluation logic.

```bash
cd backend
npm install
npm start
```
*The server will start on http://localhost:3001*

### 2. Frontend Setup
The frontend provides the user interface.

```bash
cd frontend
npm install
```

**Environment Variables**
Ensure you have a `.env.local` file in the `frontend` root with your Clerk keys:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Start the App**
```bash
npm run dev
```
*The application will be available at http://localhost:3000*

## Usage Guide
1. **Login**: Use the Clerk authentication to sign in.
2. **Select a Scenario**: Choose a test case from the dropdown (e.g., "Refund Request").
3. **Select a Persona** (Optional): If the backend is running, choose a persona to test specific agent behaviors.
4. **Input Response**: Paste or type the AI agent's response to the scenario user message.
5. **Run Check**: Click "Run Check" to see the detailed evaluation results.
