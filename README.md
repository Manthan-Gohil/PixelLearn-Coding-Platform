# PixelLearn – Full Stack SaaS Coding Education Platform

> AI-Powered Practice-First Learning Platform for Developers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm installed

### Frontend (Next.js)
```bash
cd pixellearn
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend (Express.js) - Optional
```bash
cd pixellearn/server
npm install
node index.js
```
Backend runs on [http://localhost:5000](http://localhost:5000).

## 📁 Project Structure

```
pixellearn/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout with SEO
│   │   ├── globals.css           # Design system & animations
│   │   ├── dashboard/page.tsx    # User dashboard
│   │   ├── courses/
│   │   │   ├── page.tsx          # Course listing
│   │   │   └── [courseId]/page.tsx # Course detail
│   │   ├── playground/
│   │   │   └── [courseId]/[exerciseId]/page.tsx # Code editor
│   │   ├── ai-tools/page.tsx     # AI Career Tools
│   │   ├── pricing/page.tsx      # Subscription pricing
│   │   └── api/
│   │       ├── ai/route.ts       # AI API (Groq integration)
│   │       └── execute/route.ts  # Code execution API (Piston)
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Footer.tsx            # Footer
│   │   └── DashboardContent.tsx  # Dashboard content
│   └── lib/
│       ├── types.ts              # TypeScript types
│       ├── data.ts               # Mock data & courses
│       └── store.tsx             # Global state management
├── server/
│   ├── index.js                  # Express.js backend
│   ├── package.json              # Server dependencies
│   └── .env                      # Server config
├── .env.local                    # Frontend config
└── package.json                  # Frontend dependencies
```

## ✨ Features

### 🎓 Learning System
- **5 Complete Courses**: Python, JavaScript, Web Development, React, DSA
- **20+ Interactive Exercises** with theory, problems, and solutions
- **Progressive Difficulty**: Beginner → Intermediate → Advanced
- **Chapter-based Structure** with exercise tracking

### 💻 Interactive Code Editor
- **Monaco Editor** (VS Code engine) with syntax highlighting
- **Multi-language Support**: Python, JavaScript, Java, C++, and more
- **Real-time Code Execution** via Piston API (sandboxed)
- **Output Console** with error handling
- **Code Reset** and exercise navigation

### 📊 Dashboard & Gamification
- **Personal Dashboard** with enrolled courses
- **XP System** with points per exercise
- **Streak Tracking** with daily activity
- **Badge System** (Pioneer, Consistent Coder, XP Master, etc.)
- **Weekly Activity Charts**
- **Progress Bars** per course and chapter

### 🤖 AI Career Intelligence (Pro)
- **Career Q&A Agent**: Ask career questions, get detailed guidance
- **Resume Analyzer**: ATS scoring, skills gap, improvement suggestions
- **Career Roadmap Generator**: Step-by-step roadmap with milestones

### 💰 SaaS Subscription
- **Free Plan**: Basic courses, limited exercises
- **Pro Plan** ($19/mo or $149/year): All courses, AI tools, unlimited exercises
- **Feature Comparison Table**
- **FAQ Section**
- **Monthly/Yearly billing toggle**

### 🔐 Authentication & Authorization
- Simulated Clerk-based auth
- Protected routes and API middleware
- Session management
- Role-based access (Free/Pro)

### 🎨 Design System
- **Dark Mode** with professional aesthetic
- **Glass Morphism** effects
- **Micro-animations** and transitions
- **Custom Color Palette** (Indigo + Cyan)
- **Responsive Design** (Mobile-first)
- **Inter + JetBrains Mono** typography

## 🔧 Configuration

### Groq API Key (for AI features)
Get a free API key at [https://console.groq.com/keys](https://console.groq.com/keys)

Add to `.env.local`:
```
GROQ_API_KEY=your_key_here
```

Without the key, AI features use comprehensive mock responses.

### Clerk Authentication (Production)
For production auth, add Clerk keys:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Code Editor | Monaco Editor |
| Backend | Express.js, Node.js |
| AI | Groq API (Llama 3.3 70B) |
| Code Execution | Piston API (sandboxed) |
| Icons | Lucide React |
| Animations | CSS animations |
| State | React Context |

## 📄 License

MIT License - Feel free to use for learning and projects.
