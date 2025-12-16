# 🚀 AI Resume Builder

> Build professional, ATS-optimized resumes in minutes with AI-powered suggestions.

AI Resume Builder is a modern web application that combines artificial intelligence with an intuitive interface to help users create professional resumes that pass through Applicant Tracking Systems (ATS). The application features real-time previews, AI content generation, and instant PDF export.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS, Redux Toolkit, Radix UI |
| **Backend** | Node.js, Express.js, MongoDB, JWT Authentication |
| **AI/ML** | Google Generative AI (Gemini 1.5 Flash) |
| **DevOps** | Docker, Docker Compose |
| **Performance** | Gzip Compression, Rate Limiting (100 req/sec), In-Memory Caching |

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

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://docs.mongodb.com/manual/installation/) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Google Generative AI API Key** ([Get Key](https://makersuite.google.com/app/apikey))
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sahidrajaansari/ai-resume-builder.git
cd ai-resume-builder
```

### 2️⃣ Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/ai_resume_builder
PORT=5001
JWT_SECRET_KEY=your_super_secret_jwt_key_12345
JWT_SECRET_EXPIRES_IN=1d
NODE_ENV=Dev
ALLOWED_SITE=http://localhost:5173
EOF

# Ensure MongoDB is running
brew services start mongodb-community  # macOS
# OR: docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start backend server
npm run dev
```

**Backend will run on:** `http://localhost:5001`

### 3️⃣ Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
VITE_GEMENI_API_KEY=your_google_generative_ai_api_key
VITE_APP_URL=http://localhost:5001/
VITE_BASE_URL=http://localhost:5173
EOF

# Start frontend server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:5173/
```

---

## 🐳 Docker Deployment

### Quick Start with Docker

```bash
# From Backend directory
cd Backend
docker-compose up -d

# From Frontend directory (in another terminal)
cd ../Frontend
npm install
npm run dev
```

### Manual Docker Build

```bash
# Build backend image
cd Backend
docker build -t ai-resume-backend .

# Run backend container
docker run -d \
  -p 5001:5001 \
  --env-file .env \
  --name resume-backend \
  ai-resume-backend

# Frontend runs on your local machine via Vite
```

---

## 📋 Environment Variables

### Backend (`Backend/.env`)
```plaintext
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai_resume_builder

# Server Configuration
PORT=5001
NODE_ENV=Dev

# JWT Authentication
JWT_SECRET_KEY=your_secret_key_here
JWT_SECRET_EXPIRES_IN=1d

# CORS Configuration
ALLOWED_SITE=http://localhost:5173
```

### Frontend (`Frontend/.env.local`)
```plaintext
# Google Generative AI
VITE_GEMENI_API_KEY=your_api_key_here

# API URLs
VITE_APP_URL=http://localhost:5001/
VITE_BASE_URL=http://localhost:5173
```

---

## 🔧 Configuration

### Google Generative AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Get API Key"** → **"Create new secret key"**
3. Copy the key to `Frontend/.env.local`:
   ```plaintext
   VITE_GEMENI_API_KEY=AIzaSy...
   ```

### Secure Your API Key (Production)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Select your API key and configure:
   - **Application restrictions:** HTTP referrer (website)
   - **Website restrictions:** `http://localhost:5174/*` or your domain
   - **API restrictions:** Enable **Generative Language API** only

---

## 🧪 Testing AI Generation

### Test Locally

1. Sign in or create an account
2. Go to **Dashboard** → **Edit Resume**
3. Add a **Job Title** (required for AI generation)
4. Click **"Generate from AI"** in the Summary section
5. Select a suggestion and click to apply

### Debug AI Errors

Open **DevTools** (Cmd+Option+I on macOS) → **Console** tab and:
- Check for `API_KEY_INVALID` errors
- Verify network requests in **Network** tab
- Look for CORS errors if calling from browser

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
lsof -i :27017

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or start with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5001

# Kill the process
kill -9 <PID>
```

### API Key Invalid Error
- ✅ Verify key is correct in `Frontend/.env.local`
- ✅ Check key has Generative Language API enabled
- ✅ Ensure API key restrictions allow your domain

### Frontend Network Errors
- ✅ Verify Backend is running: `lsof -i :5001`
- ✅ Check VITE_APP_URL in `Frontend/.env.local`
- ✅ Clear browser cache: `Ctrl+Shift+Delete`

---

## 📊 Project Structure

```
ai-resume-builder/
├── Frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── Services/           # API calls & AI integration
│   │   ├── store/              # Redux store
│   │   └── config/             # Configuration files
│   ├── .env.local              # Frontend environment variables
│   └── package.json
│
├── Backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── controller/         # Request handlers
│   │   ├── routes/             # API routes
│   │   ├── models/             # MongoDB schemas
│   │   ├── middleware/         # Custom middleware
│   │   └── utils/              # Helper functions
│   ├── .env                    # Backend environment variables
│   ├── docker-compose.yml      # Docker configuration
│   └── package.json
│
├── README.md                   # This file
└── Screenshot/                 # Demo screenshots
```

---

## 🚀 Performance Optimizations

### Backend
- **Gzip Compression:** 30-50% smaller responses
- **Rate Limiting:** 100 requests/second per IP
- **Database Indexing:** Fast queries on user and resume data

### Frontend
- **Code Splitting:** Lazy loading with React Suspense
- **Image Optimization:** Compressed assets
- **Caching Strategy:** Service workers for offline support

### AI Generation
- **Fast Model:** Gemini 1.5 Flash (not Pro)
- **Temperature:** 0.2 for consistent, quick responses
- **Max Tokens:** 200 for instant generation
- **Prompt Cache:** 3-minute in-memory cache prevents duplicate calls

---

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### 1. Fork the Repository
Click the **Fork** button on GitHub



### 3. Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
```

### 4. Make Your Changes
- Follow existing code style
- Test locally before committing
- Write clear commit messages

### 5. Push & Create Pull Request
```bash
git add .
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

Then create a **Pull Request** on GitHub with a clear description.

### Contribution Guidelines
- ✅ Keep PRs focused on a single feature
- ✅ Update documentation if needed
- ✅ Test on both Chrome and Firefox
- ✅ Follow the existing code style


## 🌟 Show Your Support

If you found this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or issues
- 💡 Suggesting new features
- 🤝 Contributing code

# Ai-Resume-Builder
