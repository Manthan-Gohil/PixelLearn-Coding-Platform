# Testing and Deployment Guide

## Quick Start

### 1. Environment Setup

```bash
# Install all dependencies
npm install

# Create .env.local with required variables
cat > .env.local << 'EOF'
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
EOF
```

### 2. Run Backend Server

```bash
# Development mode with auto-reload
npm run server:dev

# Or production mode
npm run server
```

Server will start on `http://localhost:5000`

### 3. Run Frontend Dev Server

In a new terminal:
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

## Testing Checklist

### Backend API Testing

#### Career Q&A Endpoint
```bash
curl -X POST http://localhost:5000/api/ai/career-qa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{
    "question": "What skills do I need to become a full-stack developer?"
  }'
```

Expected Response:
```json
{
  "success": true,
  "type": "career-qa",
  "result": "## Career Guidance\n\nBased on your question..."
}
```

#### Resume Analysis Endpoint (File Upload)
```bash
# Create a test file first
echo "John Doe
Senior Developer
10 years experience
Skills: JavaScript, React, Node.js, PostgreSQL" > resume.txt

# Upload and analyze
curl -X POST http://localhost:5000/api/ai/resume-analyze \
  -H "Authorization: Bearer demo-token" \
  -F "resume=@resume.txt"
```

Expected Response:
```json
{
  "success": true,
  "type": "resume-analyze",
  "result": {
    "atsScore": 72,
    "overallFeedback": "Your resume has good structure...",
    "skillsGap": ["Cloud Computing", "System Design"],
    "formattingFeedback": [...],
    "missingKeywords": [...],
    "improvements": [...]
  },
  "fileName": "resume.txt",
  "fileSize": 123
}
```

#### Roadmap Generator Endpoint
```bash
curl -X POST http://localhost:5000/api/ai/roadmap \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{
    "desiredRole": "Full-Stack Developer",
    "currentSkills": ["HTML", "CSS", "JavaScript"],
    "experienceLevel": "beginner"
  }'
```

Expected Response:
```json
{
  "success": true,
  "type": "roadmap",
  "result": [
    {
      "step": 1,
      "title": "Foundation Building",
      "description": "...",
      "duration": "2-3 months",
      "skills": [...],
      "resources": [...],
      "milestone": "..."
    }
  ],
  "metadata": {
    "desiredRole": "Full-Stack Developer",
    "experienceLevel": "beginner",
    "skillsCount": 3
  }
}
```

### Frontend Component Testing

#### FileUpload Component
1. Open http://localhost:3000/ai-tools
2. Click on "Resume Analyzer" tab
3. **Test drag-and-drop**:
   - Drag a file onto the upload area
   - Verify file is accepted and shown
   - Verify file size and name are displayed
4. **Test click upload**:
   - Click on the upload area
   - Select a file from file picker
5. **Test validation**:
   - Try uploading a .jpg file (should fail)
   - Try uploading a file larger than 5MB (should fail)
   - Verify error messages appear

#### ResumeReport Component
1. Upload a valid resume file
2. Verify report displays with:
   - Circular score indicator (0-100)
   - Color coding (red/yellow/green based on score)
   - Skills gap section
   - Missing keywords section
   - Formatting feedback
   - Top improvements with priority levels
   - Action summary statistics

#### CareerQA Component
1. Click on "Career Q&A" tab
2. Click on a suggested question (it fills the textarea)
3. Click "Ask AI" button
4. Verify response appears in the right panel
5. Try typing custom question and submitting

#### RoadmapGenerator Component
1. Click on "Career Roadmap" tab
2. Enter desired role: "Backend Developer"
3. Enter current skills: "JavaScript, React"
4. Select experience level: "Intermediate"
5. Click "Generate Roadmap"
6. Verify roadmap steps display with:
   - Step numbers in circles
   - Title and description
   - Duration badge
   - Skills to learn
   - Recommended resources

### Error Handling Tests

#### Missing Auth Token
```bash
curl -X POST http://localhost:5000/api/ai/career-qa \
  -H "Content-Type: application/json" \
  -d '{"question": "Test"}'
```

Expected: 401 Unauthorized

#### Missing File
```bash
curl -X POST http://localhost:5000/api/ai/resume-analyze \
  -H "Authorization: Bearer demo-token"
```

Expected: 400 Bad Request - "No file provided"

#### Invalid File Type
Upload a .exe file - should fail with "Unsupported file type" error

#### File Too Large
Upload a file > 5MB - should fail with "File size exceeds 5MB limit" error

## Groq Integration Testing

### Without GROQ_API_KEY
1. Don't set GROQ_API_KEY in .env
2. Try using any AI feature
3. Verify mock responses are returned instead
4. Check console for warning: "GROQ_API_KEY not configured"

### With GROQ_API_KEY
1. Set valid GROQ_API_KEY from https://console.groq.com
2. Try using any AI feature
3. Verify real responses from Groq are returned
4. Check response quality and relevance

## Performance Testing

### File Upload Performance
- Test with various file sizes (100KB, 1MB, 5MB)
- Measure parsing time for each format
- Verify timeout handling for large files

### API Response Time
- Measure career-qa response time (should be < 5 seconds)
- Measure resume analysis response time (should be < 10 seconds)
- Measure roadmap generation time (should be < 5 seconds)

## Deployment Checklist

- [ ] All environment variables set in production
- [ ] GROQ_API_KEY configured
- [ ] FRONTEND_URL set correctly
- [ ] Backend server running on correct port
- [ ] Frontend correctly points to backend API URL
- [ ] CORS headers properly configured
- [ ] All routes tested in production environment
- [ ] Error handling works correctly
- [ ] File upload with proper size limits
- [ ] Timeout handling for long-running requests
- [ ] Logging enabled for monitoring
- [ ] Database backups configured (if using database)

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is already in use
lsof -i :5000

# Kill the process if needed
kill -9 <PID>

# Try different port
PORT=5001 npm run server
```

### API requests failing with CORS error
- Verify FRONTEND_URL is set correctly in .env
- Check browser console for actual error message
- Verify Origin header matches FRONTEND_URL

### File upload not working
- Check file size (max 5MB)
- Check file type (.pdf, .docx, .txt)
- Verify multipart/form-data header is sent
- Check server logs for specific error

### Groq API not responding
- Verify GROQ_API_KEY is valid and active
- Check Groq dashboard for rate limits
- Verify internet connection
- Check for timeout (default 30 seconds)

### Components not loading
- Check browser console for errors
- Verify all dependencies installed (npm install)
- Clear Next.js cache: rm -rf .next
- Restart dev server

## Next Steps

1. **Integrate with Authentication System**
   - Connect to Clerk or your auth provider
   - Replace mock token with real authentication

2. **Add Database Persistence**
   - Store analysis history
   - Track user progress
   - Save favorite roles/paths

3. **Implement Analytics**
   - Track usage of each AI feature
   - Monitor Groq API costs
   - Analyze most requested features

4. **Add Premium Features**
   - Premium subscription verification
   - Limit free tier users
   - Track usage per user

5. **Optimize Performance**
   - Cache common responses
   - Implement request batching
   - Add response compression

6. **Enhanced File Support**
   - Add resume PDF parsing
   - Support MS Word files
   - Add LinkedIn profile import

## Support

For issues or questions:
1. Check logs: `npm run server` shows server logs
2. Check browser console (F12) for frontend errors
3. Review error messages in API responses
4. Refer to REFACTORING_GUIDE.md for architecture details
