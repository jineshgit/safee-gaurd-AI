# 🤖 AI Agent Behavioral Evaluator

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Status](https://img.shields.io/badge/status-production--ready-success.svg)

**Production-ready platform for testing AI agents (ChatGPT, Claude, Gemini, custom) against strict behavioral compliance policies.**

---

## ⚡ Quick Start

```bash
# 1. Setup backend
cd backend
npm install
npm run migrate
npm run seed

# 2. Start backend
npm start  # Runs on http://localhost:3001

# 3. In new terminal, start frontend
cd ..
python -m http.server 8080  # or: npx serve

# 4. Open application
# → http://localhost:8080
# → http://localhost:8080/quick-test.html (recommended)
```

**Get API Key**:
```bash
cd backend
node scripts/create-api-key.js "My Key"
```

---

## ✨ Features

✅ **10+ Advanced Metrics**: Compliance, coherence, professionalism, empathy, clarity  
✅ **Real Gemini API** Evaluation with smart fallback  
✅ **Persona System**: Test different user types (angry, confused, technical)  
✅ **Quick Test Interface**: Streamlined testing workflow  
✅ **API-First Design**: RESTful API with key authentication  
✅ **Analytics Dashboard**: Trends, comparisons, exports  
✅ **Production-Ready**: Docker, migrations, CI/CD, error handling  

---

## 📦 Docker Deployment

```bash
# Start everything
docker-compose up -d

# Create API key
docker-compose exec backend node scripts/create-api-key.js

# View logs
docker-compose logs -f
```

---

## 🔧 Configuration

Edit `backend/.env`:
```
GEMINI_API_KEY=your_key_here
PORT=3001
NODE_ENV=production
```

Get Gemini API key: https://makersuite.google.com/app/apikey

---

## 📖 Documentation

- **[Full Documentation](docs/README_PRODUCTION.md)** - Complete guide
- **[API Documentation](docs/API.md)** - API reference
- **[Test Cases](TEST_CASES.md)** - Testing guide
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Cloud deployment

---

## 🏗️ Architecture

```
Frontend (8080) → Backend API (3001) → Gemini API
                       ↓
                  SQLite Database
```

**Tech Stack**:
- Backend: Node.js, Express, SQLite, Knex
- Frontend: Vanilla JS/HTML/CSS (no build step)
- LLM: Google Gemini API
- DevOps: Docker, GitHub Actions

---

## 🧪 Usage Example

```javascript
// API call
const response = await fetch('http://localhost:3001/api/evaluate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'eai_your_key_here'
  },
  body: JSON.stringify({
    scenario_id: 'CS-REFUND-POLICY',
    response: 'I understand your frustration. Escalating to supervisor...',
    agent_name: 'GPT-4'
  })
});

const result = await response.json();
// Result: { overall: "PASS", compliance_score: 95, ... }
```

**Quick Test** (recommended):
1. Go to `http://localhost:8080/quick-test.html`
2. Select scenario → Copy message
3. Paste to ChatGPT/Claude → Copy response
4. Paste back → Evaluate
5. See results with detailed metrics

---

## 📊 Metrics

1. **Compliance Score** (0-100): Policy adherence
2. **Coherence**: Logical flow
3. **Professionalism**: Professional tone
4. **Clarity**: Clear communication
5. **Empathy**: User understanding
6. **Action Clarity**: Next steps
7. **Sentiment**: Positive/negative
8. **Readability**: Reading level
9. **Keyword Coverage**: Required actions
10. **Response Length**: Word count

---

## 🚀 Deployment Options

- **Docker**: `docker-compose up -d`
- **Railway**: One-click deploy
- **Render/Heroku**: Connect GitHub repo
- **AWS EC2**: Docker on EC2 instance

See [Deployment Guide](docs/DEPLOYMENT.md) for details.

---

## 🤝 Contributing

```bash
# Setup
git clone <repo>
npm install
npm run migrate

# Development
npm run dev  # Auto-reload

# Testing
npm test
```

---

## 📝 License

MIT - See LICENSE file

---

## 🙏 Credits

Inspired by [EfficientAI](https://github.com/EfficientAI-tech/efficientAI) voice agent evaluation platform.

Built with ❤️ for reliable AI agent testing.
