# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Create `.env.local` in the root directory:
```env
GROQ_API_KEY=your_key_from_groq_console
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
PORT=5000
```

Get your GROQ_API_KEY from: https://console.groq.com/keys

### Step 3: Start Backend Server
```bash
npm run server:dev
```

You'll see:
```
╔══════════════════════════════════════╗
║  PixelLearn API Server (Refactored)  ║
║  Running on port 5000                ║
║  http://localhost:5000                ║
╚══════════════════════════════════════╝
```

### Step 4: Start Frontend (New Terminal)
```bash
npm run dev
```

Open http://localhost:3000 and navigate to `/ai-tools`

## What's New

### Three AI Tools Available (Pro Only)

1. **Career Q&A**
   - Ask questions about career paths
   - Get personalized guidance
   - All powered by Groq AI

2. **Resume Analyzer** ⭐ NEW
   - Upload your resume (PDF, DOCX, or TXT)
   - Get ATS score (0-100)
   - Receive specific improvements
   - See skills gap and missing keywords

3. **Career Roadmap**
   - Input desired role and current skills
   - Get step-by-step learning path
   - See recommended resources
   - Track milestones

## File Structure

```
server/src/                    Backend logic
├── config/                    Configuration
├── middleware/                Middleware functions
├── controllers/               Route handlers
├── routes/                    API endpoints
├── services/                  Business logic
└── utils/                     Helpers & validators

src/                           Frontend
├── app/ai-tools/              AI tools pages
│   └── components/            Individual tools
├── components/AI/             Reusable components
├── lib/api/                   API service
└── lib/types/                 TypeScript types
```

## API Endpoints

### Career Q&A
```
POST /api/ai/career-qa
Body: { question: "..." }
Response: { success: true, result: "markdown response" }
```

### Resume Analysis (File Upload)
```
POST /api/ai/resume-analyze
Body: FormData { resume: File }
Response: { success: true, result: { atsScore, improvements, ... } }
```

### Career Roadmap
```
POST /api/ai/roadmap
Body: { desiredRole: "...", currentSkills: [...], experienceLevel: "..." }
Response: { success: true, result: [steps...] }
```

All endpoints require: `Authorization: Bearer <token>`

## Testing

### Quick Test Career Q&A
```bash
curl -X POST http://localhost:5000/api/ai/career-qa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{"question": "What skills do I need to be a developer?"}'
```

### Quick Test Resume Upload
```bash
# Create test file
echo "John Developer
Senior Software Engineer
10 years experience" > test.txt

# Upload
curl -X POST http://localhost:5000/api/ai/resume-analyze \
  -H "Authorization: Bearer demo-token" \
  -F "resume=@test.txt"
```

## Without Groq API Key?

If you don't have a Groq API key yet:
1. Don't set `GROQ_API_KEY` in `.env.local`
2. System will use mock responses automatically
3. Features still work - just with demo data
4. Get real key from https://console.groq.com to enable Groq

## Troubleshooting

**Port 5000 already in use?**
```bash
PORT=5001 npm run server:dev
```

**CORS errors?**
Check `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL

**Backend not responding?**
Make sure backend is running: `npm run server:dev` (check terminal output)

**Components not loading?**
Clear Next.js cache: `rm -rf .next` then restart

## Key Features Implemented

✅ Groq integration for all 3 AI agents  
✅ Resume file upload (PDF, DOCX, TXT)  
✅ Professional ATS analysis report  
✅ Industry-standard backend structure  
✅ Modular React components  
✅ Full TypeScript support  
✅ Comprehensive error handling  
✅ Input validation  
✅ File upload security  

## Files to Review

1. **Backend Architecture:** `REFACTORING_GUIDE.md`
2. **Testing Instructions:** `TESTING_GUIDE.md`
3. **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
4. **Source Code:** `server/src/` and `src/`

## Next: Integration with Auth

Currently using mock auth token `"demo-token"`. To integrate with real auth:

1. Update `authMiddleware.js` to verify actual tokens
2. Update frontend `aiApi.ts` to get token from auth provider
3. Connect to Clerk, Auth0, or your auth system

See `REFACTORING_GUIDE.md` for more details.

## Common Tasks

### Check Backend Logs
Look at terminal running `npm run server:dev`

### Check Frontend Errors
Open browser console: F12 or Cmd+Option+I

### View API Requests
Check Network tab in browser DevTools

### Test Different File Formats
Place files in a test folder, then use cURL or browser upload

## Performance Tips

- Keep resume files under 1MB for faster parsing
- Groq responses typically take 2-5 seconds
- Frontend caches responses automatically via SWR patterns
- Use `npm run build` for production optimization

## Production Deployment

Before deploying:
1. ✅ Set all environment variables
2. ✅ Test all endpoints
3. ✅ Verify GROQ_API_KEY is valid
4. ✅ Configure CORS properly
5. ✅ Run backend and frontend in separate processes

See `TESTING_GUIDE.md` for full deployment checklist.

## Need Help?

1. Check terminal output for error messages
2. Review `TESTING_GUIDE.md` troubleshooting section
3. Check browser console for frontend errors
4. Review inline code comments for implementation details
5. Check API responses using cURL for backend issues

---

**Ready to go!** Start with Step 1 above and you'll have everything running in minutes.
