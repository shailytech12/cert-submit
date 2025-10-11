# ML Model Connection Testing Guide

This guide shows you exactly how to check if your ML model is properly connected to the optern-student frontend.

## 🚀 Quick Start - 3 Ways to Test

### Method 1: Use the Built-in Health Check (Recommended)
1. **Start your ML model API** (usually on `http://localhost:5000`)
2. **Start the frontend**: `npm run dev`
3. **Navigate to**: `http://localhost:8080/ml-health-check`
4. **Click "Check Again"** to test the connection
5. **Use the test buttons** to verify specific functions

### Method 2: Test the Main Features
1. **Go to Job Matcher**: `http://localhost:8080/job-matcher`
2. **Upload a resume file** and enter a job description
3. **Click "Predict Match"** - if it works, your ML model is connected!

### Method 3: Test Job Recommendations
1. **Go to Job Recommendations**: `http://localhost:8080/job-recommendations`
2. **Upload a resume file**
3. **If you see personalized job recommendations**, the connection is working!

## 🔍 Detailed Testing Steps

### Step 1: Verify ML API is Running

**Check if your ML API is accessible:**
```bash
# Test in browser or terminal
curl http://localhost:5000/health

# Expected response:
{"status": "healthy", "message": "ML service is running"}
```

### Step 2: Check Frontend Connection

**Open browser console** (F12) and look for:
- ✅ **Success**: `ML Service Health: {status: "healthy"}`
- ❌ **Error**: `ML Service Error: Connection failed`

### Step 3: Test Each Function

#### A. Health Check Test
- **URL**: `/ml-health-check`
- **Expected**: Green status with "✅ Connected!"
- **If fails**: Check your ML API is running on correct port

#### B. Resume Parsing Test
- **URL**: `/ml-health-check` → Click "Test Resume Parsing"
- **Expected**: "✅ Resume parsing works! Extracted X skills"
- **If fails**: Check `/parse-resume` endpoint in your ML API

#### C. Job Recommendations Test
- **URL**: `/ml-health-check` → Click "Test Recommendations"
- **Expected**: "✅ Job recommendations work! Found X jobs"
- **If fails**: Check `/recommend-by-skills` endpoint

#### D. End-to-End Test
- **URL**: `/job-matcher` → Upload resume → Enter job description → Predict
- **Expected**: Match result with probability percentage
- **If fails**: Check `/predict-match` endpoint

## 🛠️ Troubleshooting Common Issues

### Issue 1: "Connection Failed"
**Symptoms**: Red status, "Cannot reach ML service"
**Solutions**:
1. **Check if ML API is running**:
   ```bash
   # Windows
   netstat -an | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

2. **Verify the correct port**:
   - Default: `http://localhost:5000`
   - Update in `src/config/ml-config.ts` if different

3. **Test direct API access**:
   ```
   http://localhost:5000/health
   ```

### Issue 2: "CORS Error"
**Symptoms**: Console shows CORS policy errors
**Solutions**:
1. **Add CORS to your ML API**:
   ```python
   from flask_cors import CORS
   app = Flask(__name__)
   CORS(app, origins=["http://localhost:8080"])
   ```

2. **Or allow all origins** (development only):
   ```python
   CORS(app, origins="*")
   ```

### Issue 3: "Resume Parsing Failed"
**Symptoms**: Health check shows parsing errors
**Solutions**:
1. **Check endpoint exists**: `POST /parse-resume`
2. **Verify file format**: Accept PDF, DOC, DOCX
3. **Check request format**: Expects `multipart/form-data`

### Issue 4: "Job Recommendations Failed"
**Symptoms**: Recommendations not loading
**Solutions**:
1. **Check endpoint**: `POST /recommend-by-skills`
2. **Verify request body**:
   ```json
   {
     "skills": ["Angular", "TypeScript"],
     "limit": 10
   }
   ```

## 📊 Expected API Response Formats

### Health Check Response
```json
{
  "status": "healthy",
  "message": "ML service is running"
}
```

### Resume Parsing Response
```json
{
  "skills": ["Angular", "TypeScript", "JavaScript"],
  "experience": ["2 years Frontend Development"],
  "education": ["Computer Science Degree"],
  "confidence": 0.95
}
```

### Job Match Response
```json
{
  "match_result": "Good Match",
  "probability": 0.85,
  "matched_skills": ["Angular", "TypeScript"],
  "missing_skills": ["React", "Node.js"],
  "recommendation": "Strong candidate with relevant skills"
}
```

### Job Recommendations Response
```json
[
  {
    "id": "1",
    "title": "Frontend Developer",
    "company": "Tech Corp",
    "location": "San Francisco, CA",
    "match_score": 95,
    "salary_range": "$80,000 - $120,000",
    "description": "We are looking for a skilled Frontend Developer..."
  }
]
```

## 🔧 Configuration Options

### Change API Endpoint
1. **Via Health Check Page**: Enter new URL and click "Update"
2. **Via Code**: Edit `src/config/ml-config.ts`
3. **Via Service**: Call `jobMatcherService.setApiEndpoint('new-url')`

### Environment Settings
```typescript
// src/config/ml-config.ts
export const ENVIRONMENT_CONFIGS = {
  development: {
    baseUrl: 'http://localhost:5000',  // Change this
    timeout: 30000,
    retryAttempts: 3
  }
};
```

## ✅ Success Indicators

**Your ML model is properly connected when you see:**
- ✅ Green status in health check
- ✅ Resume parsing extracts skills
- ✅ Job recommendations load
- ✅ Match predictions work
- ✅ No CORS errors in console
- ✅ No timeout errors

## 🆘 Still Having Issues?

1. **Check browser console** for detailed error messages
2. **Verify ML API logs** for server-side errors
3. **Test API endpoints directly** using Postman or curl
4. **Check network tab** in browser dev tools
5. **Ensure both services are running** on correct ports

## 📞 Quick Commands

```bash
# Start frontend
npm run dev

# Test ML API directly
curl http://localhost:5000/health

# Check if ports are in use
netstat -an | findstr :8080  # Frontend
netstat -an | findstr :5000  # ML API

# View logs (if using PM2 or similar)
pm2 logs your-ml-api
```

## 🏗️ Implementation Requirements

This guide assumes the following components are implemented in your React frontend:

### Required Pages/Components:
- `/ml-health-check` - ML service health monitoring page
- `/job-matcher` - Job matching functionality
- `/job-recommendations` - Personalized job recommendations

### Required Services:
- ML configuration service (`src/config/ml-config.ts`)
- Job matcher service for API communication
- Resume parsing service

### Required Types:
```typescript
interface MLHealthStatus {
  status: 'healthy' | 'unhealthy' | 'unknown';
  message: string;
  lastChecked?: Date;
}

interface JobMatchResult {
  match_result: string;
  probability: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string;
}

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  match_score: number;
  salary_range: string;
  description: string;
}
```

If any of these components are missing, they need to be implemented for the full testing workflow to function properly.