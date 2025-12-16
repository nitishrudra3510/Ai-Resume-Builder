# 🚀 AI Resume Builder

> Build professional, ATS-optimized resumes in minutes with AI-powered suggestions.

AI Resume Builder is a modern web application that combines artificial intelligence with an intuitive interface to help users create professional resumes that pass through Applicant Tracking Systems (ATS). The application features real-time previews, AI content generation, and instant PDF export.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla HTML5, CSS3, JavaScript (ES6+) - Zero dependencies, no build tools |
| **Backend** | Node.js, Express.js, MongoDB, JWT Authentication |
| **AI/ML** | Google Generative AI (Gemini 1.5 Flash) |
| **Performance** | Gzip Compression, Rate Limiting (100 req/sec), 2-min In-Memory Caching |

---

## ⚡ Key Features

### 🤖 AI-Powered Content Generation
- **Smart Summaries:** Generate professional summaries based on job title and experience level
- **Bullet Points:** AI-suggested work achievements and project descriptions
- **Instant Cache:** Repeated prompts return cached results (3-minute TTL)
- **Fast Model:** Gemini 1.5 Flash for sub-second response times

### 📄 ATS-Optimized Resume Design
- **Single-Column Layout:** Designed specifically for ATS parsing
- **Clean Typography:** Arial/Inter fonts for maximum readability
- **No Visual Clutter:** No colors, icons, or sidebars
- **PDF-Ready:** Print-optimized with consistent formatting

### 🔐 Secure & Reliable
- **BCrypt Hashing:** Passwords encrypted with industry-standard BCrypt
- **JWT Sessions:** Secure token-based authentication
- **MongoDB:** Scalable database with automatic backups
- **Rate Limiting:** Prevents API abuse (100 requests/second)

### 🎨 User-Friendly Interface
- **Live Preview:** See resume changes in real-time
- **Multiple Templates:** Choose from different styles
- **Drag & Drop:** Organize resume sections easily
- **Share & Download:** Generate shareable links or export as PDF

### ⚙️ Performance Optimized
- **Response Compression:** Gzip middleware for faster downloads
- **Prompt Caching:** In-memory cache prevents duplicate API calls
- **Fast Database:** Optimized MongoDB queries
- **CDN Ready:** Static assets optimized for delivery

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Node.js 16+** ([Download](https://nodejs.org/))
- **MongoDB** running locally or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikeys)

### Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file with your API keys
cat > .env << EOF
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:8000
JWT_SECRET=your_secret_key_change_in_production
EOF

# Start backend server
npm run dev
```

**Backend runs on:** `http://localhost:5001`

### Frontend Setup

```bash
cd Frontend

# Option A: Python (recommended - no setup needed)
python3 -m http.server 8000

# Option B: Node.js
node server.js

# Option C: npm script
npm start
```

**Frontend runs on:** `http://localhost:8000`

### Done! 🎉
Open browser → `http://localhost:8000` → Register → Create resume!

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
GEMINI_API_KEY=your_key_here
FRONTEND_URL=http://localhost:8000
JWT_SECRET=your_secret_here
```

### Getting API Keys

**Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikeys
2. Click "Create API Key"
3. Copy and paste into `Backend/.env`

**MongoDB:**
- Local: `mongodb://localhost:27017/ai-resume-builder`
- Atlas: Use connection string from MongoDB Atlas dashboard

---
