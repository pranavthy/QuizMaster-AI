# 🧠 QuizMaster AI

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)
![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

**An AI-powered, full-stack quiz application built for the TeachEdison internship assignment.**

[Live Demo](https://quiz-master-ai-aicy.vercel.app) · [Features](#features) · [Architecture](#architecture) · [Setup](#local-setup) · [API](#api-endpoints) · [Decisions](#design-decisions)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | Token-based registration & login via Django REST Framework |
| 🤖 **AI Quiz Generation** | Instant quiz creation on any topic using Google Gemini 2.5 Flash |
| 🎯 **Live Progress Tracking** | Animated progress bar and question-by-question navigation |
| ⏱️ **Quiz Timer** | Countdown timer to add challenge and time pressure |
| 📊 **Detailed Results** | Score, accuracy %, and a full question-by-question review |
| 📚 **Quiz History** | Dashboard showing all past quizzes and attempt scores |
| 📱 **Fully Responsive** | Clean, modern UI optimized for desktop and mobile |
| ⚡ **Graceful Error Handling** | API failures, network issues, and edge cases handled elegantly |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│            Next.js 15 (App Router, TypeScript)              │
│      Tailwind CSS · Axios · React Context (AuthContext)     │
└─────────────────────────┬───────────────────────────────────┘
                          │  HTTP/REST (JSON)
                          │  Auth: Token Header
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                               │
│           Django 5.2 + Django REST Framework                │
│        TokenAuthentication · CORS · Custom Views            │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐     ┌────────────────────────────────┐
│   PostgreSQL (Neon)  │     │  Google Gemini 2.5 Flash API   │
│  Cloud-hosted DB     │     │  AI Question Generation         │
└──────────────────────┘     └────────────────────────────────┘
```

---

## 🗄️ Database Design

```
User (Django built-in)
  │
  ├── Quiz (topic, difficulty, num_questions, creator_fk)
  │     └── Question (text, quiz_fk)
  │           └── Choice (text, is_correct, question_fk)
  │
  └── QuizAttempt (user_fk, quiz_fk, score, completed_at)
        └── UserAnswer (attempt_fk, question_fk, choice_fk)
```

**Key Design Choices:**
- `Creator` FK on Quiz allows future multi-user quiz sharing
- `QuizAttempt` is separate from `Quiz` so users can retake the same quiz multiple times
- `UserAnswer` stores the exact `choice_id` selected — enabling detailed per-question reviews
- `is_correct` is stored on `Choice`, not computed per-answer, keeping results fast to calculate

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register/` | Create a new user account | ❌ |
| `POST` | `/api/auth/login/` | Login and receive an auth token | ❌ |
| `GET` | `/api/auth/user/` | Retrieve current logged-in user | ✅ |
| `GET` | `/api/quizzes/` | List all available quizzes | ✅ |
| `POST` | `/api/quizzes/generate/` | Generate a new AI quiz | ✅ |
| `GET` | `/api/quizzes/<id>/` | Get quiz questions (without answers) | ✅ |
| `POST` | `/api/quizzes/<id>/submit/` | Submit answers, calculate & save score | ✅ |
| `GET` | `/api/attempts/` | List all of the user's past attempts | ✅ |
| `GET` | `/api/attempts/<id>/` | Get detailed results for an attempt | ✅ |

---

## ⚙️ Local Setup

### Prerequisites
- **Python** 3.11+
- **Node.js** 18+

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows
source venv/bin/activate       # Mac/Linux

pip install django djangorestframework psycopg2-binary python-dotenv django-cors-headers requests dj-database-url
```

Create `backend/.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key
DATABASE_URL=postgresql://your_neon_connection_string
```

```bash
python manage.py makemigrations quiz
python manage.py migrate
python manage.py runserver     # Running on localhost:8000
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```bash
npm run dev                    # Running on localhost:3000
```

### Open the App
Visit **http://localhost:3000** — Register → Generate Quiz → Take Quiz → See Results!

---

## 💭 Design Decisions & Trade-offs

### Why Token Auth over JWT?
Django REST Framework's built-in `TokenAuthentication` was chosen for **simplicity and reliability**. For a production app, stateless JWT would be better for horizontal scaling, but token auth is simpler to debug and has no expiry complexity for this scope.

### Why Neon PostgreSQL over local Postgres?
Local PostgreSQL setup on Windows involves complex installation and PATH configuration that is error-prone. Neon provides an identical PostgreSQL environment with a simple connection string via `dj-database-url`. This is a real-world pattern — most production apps use cloud-managed databases.

### Why store `is_correct` on `Choice` not `UserAnswer`?
Storing it on `Choice` enables the backend to efficiently compute scores with a single query. If we stored it on `UserAnswer`, we'd need to cross-reference two tables on every score calculation. Denormalizing here for read performance is an intentional trade-off.

### Why not use the official `google-generativeai` SDK?
The raw HTTP approach using `requests` is more transparent and dependency-light. It directly shows understanding of how REST APIs work. The SDK adds abstraction overhead without meaningful benefit at this scale.

### AI Response Parsing Strategy
The prompt strictly instructs Gemini to return raw JSON with no markdown. The parser also strips `\`\`\`json` fences as a safety fallback since LLMs occasionally disobey formatting instructions. If parsing fails entirely, the API returns a clear error (not silently saving bad data).

### Skipped Features
- **Quiz Sharing / Public Quizzes**: Intentionally skipped to focus on core single-user flow. The DB schema supports it via the `creator` FK.
- **Email Verification**: Skipped for development velocity — standard registration is sufficient for the scope.

---

## 🚧 Challenges & How I Solved Them

1. **Gemini API model deprecation** — `gemini-1.5-flash` returned 404. Solved by querying the `/models` endpoint to dynamically discover active models, then updating to `gemini-2.5-flash`.

2. **API Quota Limits (429)** — The free tier has RPM limits. Solved by raising explicit API errors from the backend instead of silently falling back to placeholder data, so users always know the true state.

3. **CORS Configuration** — The frontend made cross-origin requests to the Django backend. Solved by correctly ordering the `CorsMiddleware` before `CommonMiddleware` in Django settings.

4. **PostgreSQL SSL on Neon** — Neon requires `sslmode=require` in the connection string. Solved by including it in `DATABASE_URL` and using `dj-database-url` to parse it correctly.
5. **Session Expiry Handling** — Frontend would crash or show error pages if the stored token became invalid. Solved by implementing a global **Axios Response Interceptor** that detects `401 Unauthorized` errors and automatically redirects users to the login page.

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | [https://quiz-master-ai-aicy.vercel.app](https://quiz-master-ai-aicy.vercel.app) |
| **Backend API (Render)** | [https://quizmaster-ai-7kmc.onrender.com/api](https://quizmaster-ai-7kmc.onrender.com/api) |
| **Admin Panel** | [https://quizmaster-ai-7kmc.onrender.com/admin](https://quizmaster-ai-7kmc.onrender.com/admin) |

> **Note:** The backend is hosted on Render's free tier, which spins down after inactivity. The first request may take ~30-60 seconds to wake up.

---

## 🔑 Evaluation Credentials

For recruiters and evaluators to review the backend data and user management:

- **Admin Panel**: [https://quizmaster-ai-7kmc.onrender.com/admin](https://quizmaster-ai-7kmc.onrender.com/admin)
- **Username**: `admin`
- **Password**: `admin123`

---

<div align="center">
Built with ❤️ for the TeachEdison Fullstack Developer Internship Assignment
</div>
