# 🛡️ Digital Footprint Shield

A privacy-focused MVP application that helps users assess their digital safety, respond to online harassment, and take action to protect themselves.

> **No account required. Your data is stored only in your browser unless you choose to save it.**

---

## 👥 Team Members

- **[Egrah Savai](mailto:savaiegrah@gmail.com)** - +254742651608

- **[Vivian Mutai](mailto:Vivyearnjepkorir@gmail.com)** - +254704067949

- **[Christine Wambui](mailto:tinabakari26@gmail.com)** - +254710763375

- **[Hibaq Kuresh](mailto:hibaqku7@gmail.com)** - +254707301008

_Mary Njengah has left the project_

---

## 🚀 Quick Start

### Frontend Only (Recommended for Hackathon)

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

### With Backend (Optional)

```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
flask run
```

```bash
# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
digital-footprint-shield/
├── frontend/           # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── utils/      # Score calculator, message analyzer
│   │   └── assets/     # Images and icons
├── backend/            # Optional Flask API
│   ├── api/           # Routes and models
│   └── app.py         # Flask entry point
└── demo-samples/      # Sample data for testing
```

---

## ✨ Features

- **🔍 Privacy Assessment** - 10-question self-assessment to evaluate your digital footprint
- **📊 Safety Score** - Visual score card with personalized risk breakdown
- **📋 Action Plan** - Customized checklist based on your assessment results
- **💬 Response Assistant** - Generate 4 response templates for handling harassment
- **📄 Export to PDF** - Save your action plan and responses (with watermark protection)
- **🔒 Blurred Preview Mode** - Anti-screenshot protection for sensitive content

---

## 🎨 Brand Colors

| Color          | Hex       | Usage                 |
| -------------- | --------- | --------------------- |
| Deep Purple    | `#4B2E83` | Primary, headers      |
| Sunrise Orange | `#F79E38` | Accent, CTAs          |
| Soft Cream     | `#F7F4ED` | Background            |
| Charcoal       | `#1A1A1A` | Body text             |
| Light Lilac    | `#EDE6F7` | Secondary backgrounds |

---

## 🔧 NPM Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run test     # Run Jest tests
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Deploy!

```bash
# Or use Vercel CLI
cd frontend
npx vercel
```

### Backend → Railway/Render

#### Railway

1. Create new project at [Railway](https://railway.app)
2. Connect GitHub repo
3. Set root directory to `backend`
4. Add environment variables if using AI APIs:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`

#### Render

1. Create new Web Service at [Render](https://render.com)
2. Connect GitHub repo
3. Set root directory: `backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app`

---

## 🔐 AI Integration (Optional)

The app works fully offline with keyword-based analysis. To enable AI-powered responses:

### Google Gemini (Recommended - Frontend)

1. Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create `.env` file in `frontend/`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Restart the dev server - the AI Companion will now use Gemini!

> **Note:** The companion has a toggle button (🤖 AI / 📴 Offline) to switch between AI and offline modes.

### OpenAI / Anthropic (Backend Alternative)

1. Get API key from [OpenAI](https://platform.openai.com) or [Anthropic](https://console.anthropic.com)
2. Create `.env` file in `backend/`:
   ```env
   OPENAI_API_KEY=sk-...
   # or
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. Uncomment AI integration code in `backend/api/model.py`

---

## ⚠️ Screenshot Protection Note

**Complete screenshot prevention is impossible.** This app implements:

- Blurred preview mode with 5-second ephemeral reveal
- Watermark overlay on exported PDFs
- Visual deterrents for casual screenshotting

These measures deter casual sharing but cannot prevent determined capture.

---

## 🧪 Testing

```bash
cd frontend
npm run test
```

---

## 📝 License

MIT License - Built for hackathon use.

---

## 🤝 Contributing

This is an MVP built for a 24-48 hour hackathon. PRs welcome for:

- Accessibility improvements
- Additional language support
- Enhanced AI integrations

---

**Built with 💜 for digital safety**
