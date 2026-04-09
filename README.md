# PixelLearn – Full Stack SaaS Coding Education Platform

> AI-Powered Practice-First Learning Platform for Developers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm installed

### Setup & Run
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   │       ├── execute/route.ts  # Code execution API (Piston)
│   │       ├── courses/route.ts   # Course data API
│   │       └── user/             # User & Progress APIs
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Footer.tsx            # Footer
│   │   └── DashboardContent.tsx  # Dashboard content
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client
│   │   └── types.ts              # TypeScript types
│   ├── services/
│   │   └── data.ts               # Mock data & courses
│   └── store/
│       └── index.tsx             # Global state management
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeder
├── .env.local                    # Environment variables
└── package.json                  # Dependencies & scripts
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
- **Real-time Code Execution** via Wandbox API
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

### 🔐 Authentication & Authorization
- Clerk-based authentication
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

### Database Setup
The project uses PostgreSQL with Prisma. Update `DATABASE_URL` in `.env.local` and run:
```bash
npx prisma migrate dev
npx prisma db seed
```

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Full Stack Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | Clerk |
| Styling | Tailwind CSS 4 |
| Code Editor | Monaco Editor |
| AI | Groq API (Llama 3.3 70B) |
| Code Execution | Wandbox API |
| Icons | Lucide React |

## 📄 License

MIT License - Feel free to use for learning and projects.
