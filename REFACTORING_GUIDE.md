# PixelLearn Codebase Refactoring Guide

## Overview
This document describes the refactoring of the PixelLearn codebase to follow industry best practices with proper separation of concerns, modular architecture, and integration of Groq AI for all three AI agents.

## Key Changes

### Backend Refactoring (Express.js)

#### Directory Structure
```
server/src/
├── config/                 # Configuration files
│   ├── groq.js            # Groq API configuration
│   └── cors.js            # CORS middleware setup
├── middleware/            # Middleware functions
│   ├── auth.js            # Authentication middleware
│   ├── premium.js         # Premium subscription check
│   └── errorHandler.js    # Global error handling
├── controllers/           # Route handlers
│   ├── aiController.js    # AI endpoints (career-qa, resume-analyze, roadmap)
│   ├── userController.js  # User operations
│   └── legacyController.js # Backward compatibility handlers
├── routes/                # API routes
│   ├── aiRoutes.js        # /api/ai/* routes
│   └── userRoutes.js      # /api/user/* routes
├── services/              # Business logic
│   ├── aiService.js       # Groq AI service (all LLM calls)
│   └── fileService.js     # File upload/parsing service
├── utils/                 # Utilities
│   ├── errors.js          # Custom error class
│   ├── constants.js       # App constants & prompts
│   └── validators.js      # Input validation helpers
└── index.js              # App entry point
```

#### Key Features
1. **Groq Integration**: All three AI agents use Groq's llama-3.3-70b-versatile model
2. **File Upload Support**: Resume analysis with PDF, DOCX, and TXT file upload
3. **Structured Prompts**: Industry-standard ATS analyzer, career counselor, and roadmap generator prompts
4. **Error Handling**: Comprehensive error handling with custom AppError class
5. **Middleware Architecture**: Clean separation of concerns with auth, premium, and error middleware

### Frontend Refactoring (Next.js)

#### New Component Structure
```
src/
├── components/
│   └── AI/
│       ├── FileUpload.tsx         # Drag-drop file upload component
│       ├── ResumeReport.tsx       # Report display component
│       └── ScoreDisplay.tsx       # (Optional) Score visualization
├── app/ai-tools/
│   ├── page.tsx                  # Main page (refactored)
│   └── components/
│       ├── CareerQAComponent.tsx      # Career Q&A tool
│       ├── ResumeAnalyzerComponent.tsx # Resume analysis with upload
│       └── RoadmapGeneratorComponent.tsx # Roadmap generator
└── lib/
    ├── api/
    │   └── aiApi.ts              # API service layer
    └── types/
        └── ai.ts                 # TypeScript types
```

#### Key Features
1. **Modular Components**: Each AI tool is a separate, reusable component
2. **File Upload**: Drag-and-drop file upload with validation
3. **Report Format**: Professional visual report matching the design in the spec
4. **Type Safety**: Full TypeScript support with defined interfaces
5. **Service Layer**: Clean API service layer for backend communication

### Resume Analysis Enhancements

#### File Upload Support
- Accepts: PDF, DOCX, TXT formats
- Max size: 5MB
- Drag-and-drop interface with visual feedback

#### Report Format
The report displays:
1. **Overall Score**: Circular progress indicator (0-100) with color coding
2. **Status Indicators**: High (red), Medium (yellow), Good (green), Excellent (green)
3. **Four Metrics**: Impact, Brevity, Style, Skills (optional based on AI response)
4. **Skills Gap**: Missing skills needed for target role
5. **Missing Keywords**: ATS-relevant keywords to add
6. **Formatting Feedback**: Improvement suggestions
7. **Top Improvements**: Prioritized list of changes to make
8. **Action Summary**: Quick stats (skills to learn, keywords to add, etc.)

### Groq AI Integration

#### Three AI Agents

**1. Career Q&A**
- **Endpoint**: POST `/api/ai/career-qa`
- **Input**: Text question about career
- **Output**: Markdown-formatted guidance
- **Prompt**: Professional career counselor specializing in tech careers

**2. Resume Analyzer** (NEW with file upload)
- **Endpoint**: POST `/api/ai/resume-analyze`
- **Input**: File upload (PDF/DOCX/TXT)
- **Output**: Structured JSON with ATS analysis
- **Prompt**: Expert ATS resume analyzer
- **Features**:
  - Automatic file parsing
  - Text extraction from PDF/DOCX/TXT
  - ATS score calculation (0-100)
  - Skills gap analysis
  - Keyword recommendations
  - Formatting feedback

**3. Roadmap Generator**
- **Endpoint**: POST `/api/ai/roadmap`
- **Input**: Desired role, current skills, experience level
- **Output**: Step-by-step learning roadmap
- **Prompt**: Career learning path designer

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install cors express multer dotenv
   ```

2. **Set Environment Variables**
   ```bash
   # .env.local (in root directory)
   GROQ_API_KEY=your_groq_api_key_here
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   ```

3. **Start Backend Server**
   ```bash
   npm run server:dev
   # Or for production
   npm run server
   ```

### Frontend Setup

1. **Set Environment Variables**
   ```bash
   # .env.local (in root directory)
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

2. **Start Next.js Dev Server**
   ```bash
   npm run dev
   ```

### File Parsing Libraries (Optional)

For enhanced file parsing, install:
```bash
npm install pdf-parse mammoth
```

These are optional and the system will fallback to mock responses if not installed.

## API Endpoints

### AI Routes
```
POST /api/ai/career-qa
- Authorization: Bearer <token>
- Body: { question: string }
- Response: { success: true, type: "career-qa", result: string }

POST /api/ai/resume-analyze
- Authorization: Bearer <token>
- Body: FormData with "resume" file
- Response: { success: true, type: "resume-analyze", result: { atsScore, improvements, ... }, fileName, fileSize }

POST /api/ai/roadmap
- Authorization: Bearer <token>
- Body: { desiredRole: string, currentSkills: string[], experienceLevel: string }
- Response: { success: true, type: "roadmap", result: RoadmapStep[], metadata }
```

### User Routes
```
GET /api/user/profile
- Authorization: Bearer <token>
- Response: { success: true, user: {...} }

PUT /api/user/profile
- Authorization: Bearer <token>
- Body: { name?, email?, ... }
- Response: { success: true, user: {...} }
```

## Migration Path

1. ✅ Created new server structure with all services
2. ✅ Implemented Groq integration for all three agents
3. ✅ Added resume file upload support
4. ✅ Refactored frontend components
5. ✅ Created professional report display
6. **Next**: Test all endpoints and integrate with existing auth
7. **Next**: Deploy and migrate traffic from old endpoints

## Backward Compatibility

- All existing endpoints remain functional
- New file upload for resume analyzer coexists with text input option
- Legacy routes (health check, code execution) are maintained

## Best Practices Implemented

1. **Separation of Concerns**: Controllers, services, routes, middleware clearly separated
2. **Error Handling**: Custom AppError class with proper HTTP status codes
3. **Input Validation**: Comprehensive validators for all inputs
4. **Type Safety**: Full TypeScript support throughout
5. **Modular Components**: Reusable React components with single responsibility
6. **Service Layer**: Clean API service layer for frontend-backend communication
7. **Environment Configuration**: All secrets and configs in environment variables
8. **File Upload Security**: File type and size validation
9. **Response Formatting**: Consistent JSON response format across all endpoints
10. **Documentation**: Inline comments and clear code structure

## Testing Recommendations

1. **Backend**:
   - Test each controller with valid/invalid inputs
   - Test file upload with different file types and sizes
   - Test error handling scenarios
   - Test Groq API integration with mock responses

2. **Frontend**:
   - Test file upload component with drag-drop
   - Test report display with different scores
   - Test form validations
   - Test error handling and fallback states

3. **Integration**:
   - End-to-end testing of resume upload and analysis
   - Test all three AI agents with Groq
   - Test authentication and premium subscription checks

## Future Enhancements

1. Add database persistence for analysis history
2. Implement user accounts and profiles
3. Add resume templates and suggestions
4. Implement subscription tier management
5. Add analytics and usage tracking
6. Create admin dashboard for monitoring
7. Add more AI agents (interview prep, portfolio review, etc.)
