# Deployment Guide

Safeguard AI is a Next.js application with a local SQLite database (`sql.js` + filesystem).

## Option 1: Docker (Recommended for Production)

Docker allows you to run the application anywhere (VPS, DigitalOcean, AWS, Railway, Render) with full persistence.

### 1. Build the Image
```bash
docker build -t safeguard-ai .
```

### 2. Run the Container
Map the database file to a volume to persist data across restarts.

```bash
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here \
  -e CLERK_SECRET_KEY=your_key_here \
  safeguard-ai
```
*(Note: Ensure the `extensions.db` path in `database.js` points to `/app/data/evaluations.db` if you want strict volume mapping, or just mount the root app directory cautiously. By default, it writes to `process.cwd()/evaluations.db` which is `/app/evaluations.db` in Docker.)*

### 3. Deploy to Railway / Render
1. Connect your GitHub repository.
2. It will auto-detect the `Dockerfile`.
3. Add a **Volume** mounting to `/app` (or specifically `/app/evaluations.db`) to keep your data.
4. Set Environment Variables in the dashboard.

---

## Option 2: Vercel / Netlify (Serverless)

You can deploy to Vercel, but **database changes will not persist**.
- The `evaluations.db` file is read from the filesystem.
- On serverless functions, the filesystem is ephemeral (resets on every redeploy/cold start).
- **Result:** You will lose evaluation history and custom scenarios on every deployment.
- **Fix:** Connect a real external database (Postgres/Turso) and update `lib/database.js` to use it.

### Deployment Steps:
1. Push to GitHub.
2. Import project in Vercel.
3. Add Environment Variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`).
4. Deploy.

---

## Option 3: Local Production

To run the production build locally:

```bash
# 1. Build
npm run build

# 2. Start
npm start
```

Runs on `http://localhost:3000`.
