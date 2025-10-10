# Job Recommendation System Integration Guide

This guide explains how to integrate the ML job recommendation model with your student frontend and job portal API.

## Overview

The integration consists of:

1. **Frontend Components**: React components for job recommendations, search, and applications
2. **API Services**: Integration layer for job portals and ML model
3. **ML Model**: Python FastAPI server for job recommendations
4. **Database**: Firebase Firestore for storing profiles and applications

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Student       │    │   Job Portal     │    │   ML Model      │
│   Frontend      │◄──►│   API Service    │◄──►│   (FastAPI)     │
│   (React)       │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Firebase      │    │   External Job   │    │   Job Data      │
│   Firestore     │    │   APIs (Adzuna,  │    │   Processing    │
│                 │    │   Indeed, etc.)  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update `.env` with your API keys:

```env
# Firebase Configuration (existing)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Job Portal APIs
VITE_JOBS_API_KEY=your_job_portal_api_key
VITE_ADZUNA_APP_ID=your_adzuna_app_id
VITE_ADZUNA_APP_KEY=your_adzuna_app_key

# ML Model
VITE_ML_MODEL_URL=http://localhost:8000
VITE_ML_API_KEY=your_ml_api_key
```

### 2. ML Model Setup

#### Option A: Use the Example Model

1. Install Python dependencies:
```bash
pip install -r ml-requirements.txt
```

2. Run the example ML model:
```bash
python ml-model-example.py
```

The model will be available at `http://localhost:8000`

#### Option B: Replace with Your Own Model

Replace the example model with your own ML model that implements the same API endpoints:

- `POST /recommend` - Get job recommendations
- `GET /health` - Health check

### 3. Job Portal API Integration

#### Adzuna API (Free Tier Available)

1. Sign up at [Adzuna API](https://developer.adzuna.com/)
2. Get your App ID and App Key
3. Add them to your `.env` file

#### Custom Job Portal API

If you have your own job portal API, update `src/lib/jobApi.ts`:

```typescript
// Update the JOBS_API configuration
JOBS_API: {
  baseUrl: 'https://your-job-api.com/v1',
  apiKey: process.env.VITE_JOBS_API_KEY || '',
}
```

### 4. Firebase Database Schema Updates

Add these new collections to your Firestore:

#### Student Profiles Collection (`studentProfiles`)
```javascript
{
  id: string,
  userId: string,
  skills: string[],
  interests: string[],
  experience: 'entry' | 'mid' | 'senior',
  preferredJobTypes: string[],
  preferredLocations: string[],
  salaryExpectation: {
    min: number,
    max: number,
    currency: string
  },
  resume: {
    url: string,
    fileName: string,
    uploadedAt: Date
  },
  bio: string,
  education: EducationEntry[],
  workExperience: WorkExperience[],
  createdAt: Date,
  updatedAt: Date
}
```

#### Job Applications Collection (`jobApplications`)
```javascript
{
  id: string,
  studentId: string,
  jobId: string,
  job: Job,
  status: 'applied' | 'viewed' | 'interview' | 'offered' | 'rejected' | 'withdrawn',
  appliedAt: Date,
  notes: string,
  interviewDate: Date,
  followUpDate: Date
}
```

### 5. Firestore Security Rules

Update your Firestore rules to include the new collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Existing rules...
    
    // Student profiles
    match /studentProfiles/{profileId} {
      allow read, write: if request.auth != null && 
        (profileId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Job applications
    match /jobApplications/{applicationId} {
      allow read, write: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.studentId;
    }
  }
}
```

### 6. Frontend Integration

The integration is already complete in your React frontend with these new features:

#### New Dashboard Tabs
- **Job Recommendations**: AI-powered job suggestions
- **Job Search**: Search and browse jobs from multiple sources
- **My Applications**: Track job application status
- **Profile Setup**: Configure skills, preferences, and experience

#### Key Components
- `JobRecommendations.tsx` - Displays ML-powered recommendations
- `JobSearch.tsx` - Job search and filtering
- `JobApplications.tsx` - Application tracking
- `ProfileSetup.tsx` - Student profile management

## Testing the Integration

### 1. Start the ML Model
```bash
python ml-model-example.py
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Test Flow

1. **Register/Login** as a student
2. **Setup Profile**: Go to "Profile Setup" tab and add:
   - Skills (e.g., JavaScript, React, Python)
   - Experience level
   - Job preferences
   - Bio and education

3. **Get Recommendations**: Go to "Job Recommendations" tab
   - Should show AI-powered job suggestions
   - Recommendations based on your profile and certificates

4. **Search Jobs**: Go to "Job Search" tab
   - Search for jobs by keywords, location, type
   - Apply for jobs directly

5. **Track Applications**: Go to "My Applications" tab
   - View all applied jobs
   - Update application status
   - Track interview dates

## API Endpoints

### ML Model Endpoints

- `GET /health` - Health check
- `POST /recommend` - Get job recommendations
- `GET /jobs` - List available jobs (for testing)

### Job Portal Integration

The system integrates with:
- Your custom job portal API
- Adzuna API (job search)
- Other job APIs (easily extensible)

## Customization

### Adding New Job Sources

To add a new job API source:

1. Update `src/lib/jobApi.ts`
2. Add new API configuration
3. Implement transformation methods
4. Add to the search aggregation

### Enhancing the ML Model

To improve recommendations:

1. Add more features (location, salary, company size)
2. Use advanced ML algorithms (collaborative filtering, deep learning)
3. Implement feedback learning from user interactions
4. Add real-time model updates

### Custom Skills Extraction

Update `src/lib/profileService.ts` to improve skills extraction from certificates:

```typescript
private extractSkillsFromCertificate(certificate: Certificate): string[] {
  // Add your custom logic here
  // Could use NLP, predefined mappings, or external APIs
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure ML model allows your frontend origin
2. **API Key Issues**: Check environment variables are loaded correctly
3. **Firebase Rules**: Verify Firestore security rules allow access
4. **ML Model Not Starting**: Check Python dependencies are installed

### Debug Mode

Enable debug logging by updating the console.log statements in the service files.

## Production Deployment

### ML Model Deployment

Deploy your ML model to:
- **Heroku**: Easy Python deployment
- **AWS Lambda**: Serverless deployment
- **Google Cloud Run**: Container deployment
- **Your own server**: Traditional deployment

### Environment Variables

Set production environment variables:
- Use production Firebase project
- Use production API keys
- Set production ML model URL

### Performance Optimization

1. **Caching**: Implement Redis caching for job data
2. **CDN**: Use CDN for static assets
3. **Database Indexing**: Add Firestore indexes for queries
4. **API Rate Limiting**: Implement rate limiting for external APIs

## Next Steps

1. **Enhanced ML Model**: Implement more sophisticated recommendation algorithms
2. **Real-time Updates**: Add WebSocket connections for real-time job updates
3. **Mobile App**: Extend to React Native mobile app
4. **Analytics**: Add user behavior tracking and analytics
5. **Notifications**: Implement email/push notifications for new job matches

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation at `http://localhost:8000/docs`
3. Check browser console for frontend errors
4. Review server logs for backend issues