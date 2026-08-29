#!/usr/bin/env python3
"""
Example ML Job Recommendation Model API
This is a simple FastAPI server that provides job recommendations based on student profiles.
You can extend this with your actual ML model implementation.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

app = FastAPI(title="Job Recommendation ML API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Certificate(BaseModel):
    type: str
    skills: List[str]

class JobPreferences(BaseModel):
    jobTypes: List[str]
    locations: List[str]
    salaryRange: Optional[dict] = None

class MLRecommendationRequest(BaseModel):
    studentId: str
    skills: List[str]
    experience: str
    preferences: JobPreferences
    certificates: List[Certificate]

class JobRecommendation(BaseModel):
    jobId: str
    score: float
    reasons: List[str]

class MLRecommendationResponse(BaseModel):
    recommendations: List[JobRecommendation]
    modelVersion: str
    timestamp: datetime

# Mock job database (replace with your actual job data source)
MOCK_JOBS = [
    {
        "id": "job_1",
        "title": "Frontend Developer",
        "company": "TechCorp",
        "skills": ["JavaScript", "React", "CSS", "HTML"],
        "experience": "entry",
        "type": "full-time",
        "location": "New York",
        "description": "Build modern web applications using React and JavaScript"
    },
    {
        "id": "job_2", 
        "title": "Data Scientist",
        "company": "DataInc",
        "skills": ["Python", "Machine Learning", "SQL", "Statistics"],
        "experience": "mid",
        "type": "full-time", 
        "location": "San Francisco",
        "description": "Analyze data and build predictive models"
    },
    {
        "id": "job_3",
        "title": "Backend Developer", 
        "company": "ServerSoft",
        "skills": ["Node.js", "Python", "SQL", "API Development"],
        "experience": "entry",
        "type": "remote",
        "location": "Remote",
        "description": "Develop server-side applications and APIs"
    },
    {
        "id": "job_4",
        "title": "Mobile Developer",
        "company": "MobileFirst",
        "skills": ["React Native", "JavaScript", "iOS", "Android"],
        "experience": "mid",
        "type": "contract",
        "location": "Austin",
        "description": "Create cross-platform mobile applications"
    },
    {
        "id": "job_5",
        "title": "DevOps Engineer",
        "company": "CloudTech",
        "skills": ["AWS", "Docker", "Kubernetes", "Python"],
        "experience": "senior",
        "type": "full-time",
        "location": "Seattle",
        "description": "Manage cloud infrastructure and deployment pipelines"
    }
]

class JobRecommendationModel:
    """Simple job recommendation model using TF-IDF and cosine similarity"""
    
    def __init__(self):
        self.jobs_df = pd.DataFrame(MOCK_JOBS)
        self.vectorizer = TfidfVectorizer()
        self._prepare_job_features()
    
    def _prepare_job_features(self):
        """Prepare job features for similarity calculation"""
        # Combine job skills and description for feature extraction
        job_texts = []
        for _, job in self.jobs_df.iterrows():
            text = " ".join(job['skills']) + " " + job['description']
            job_texts.append(text)
        
        self.job_features = self.vectorizer.fit_transform(job_texts)
    
    def get_recommendations(self, request: MLRecommendationRequest) -> List[JobRecommendation]:
        """Generate job recommendations based on student profile"""
        
        # Combine student skills and certificate skills
        all_skills = request.skills.copy()
        for cert in request.certificates:
            all_skills.extend(cert.skills)
        
        # Remove duplicates
        all_skills = list(set(all_skills))
        
        # Create student feature vector
        student_text = " ".join(all_skills)
        student_features = self.vectorizer.transform([student_text])
        
        # Calculate similarity scores
        similarities = cosine_similarity(student_features, self.job_features)[0]
        
        recommendations = []
        for idx, (_, job) in enumerate(self.jobs_df.iterrows()):
            score = similarities[idx]
            
            # Apply additional scoring based on preferences and experience
            adjusted_score = self._adjust_score(job, request, score)
            
            if adjusted_score > 0.1:  # Minimum threshold
                reasons = self._generate_reasons(job, request, all_skills)
                
                recommendations.append(JobRecommendation(
                    jobId=job['id'],
                    score=float(adjusted_score * 100),  # Convert to percentage
                    reasons=reasons
                ))
        
        # Sort by score and return top 10
        recommendations.sort(key=lambda x: x.score, reverse=True)
        return recommendations[:10]
    
    def _adjust_score(self, job, request: MLRecommendationRequest, base_score: float) -> float:
        """Adjust score based on job preferences and experience match"""
        score = base_score
        
        # Experience level matching
        if job['experience'] == request.experience:
            score += 0.2
        elif (job['experience'] == 'entry' and request.experience == 'mid') or \
             (job['experience'] == 'mid' and request.experience == 'senior'):
            score += 0.1
        
        # Job type preference
        if job['type'] in request.preferences.jobTypes:
            score += 0.15
        
        # Location preference
        if any(loc.lower() in job['location'].lower() for loc in request.preferences.locations):
            score += 0.1
        
        return min(score, 1.0)  # Cap at 1.0
    
    def _generate_reasons(self, job, request: MLRecommendationRequest, student_skills: List[str]) -> List[str]:
        """Generate reasons why this job is recommended"""
        reasons = []
        
        # Skill matching
        matching_skills = [skill for skill in job['skills'] if skill in student_skills]
        if matching_skills:
            reasons.append(f"Matches {len(matching_skills)} of your skills: {', '.join(matching_skills[:3])}")
        
        # Experience level
        if job['experience'] == request.experience:
            reasons.append(f"Perfect match for your {request.experience} experience level")
        
        # Job type
        if job['type'] in request.preferences.jobTypes:
            reasons.append(f"Matches your preferred job type: {job['type']}")
        
        # Certificate relevance
        cert_skills = []
        for cert in request.certificates:
            cert_skills.extend(cert.skills)
        
        cert_matches = [skill for skill in job['skills'] if skill in cert_skills]
        if cert_matches:
            reasons.append(f"Aligns with your certified skills: {', '.join(cert_matches[:2])}")
        
        return reasons

# Initialize the model
model = JobRecommendationModel()

@app.get("/")
async def root():
    return {"message": "Job Recommendation ML API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/recommend", response_model=MLRecommendationResponse)
async def get_recommendations(request: MLRecommendationRequest):
    """Get job recommendations for a student"""
    try:
        recommendations = model.get_recommendations(request)
        
        return MLRecommendationResponse(
            recommendations=recommendations,
            modelVersion="1.0.0",
            timestamp=datetime.now()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.get("/jobs")
async def get_jobs():
    """Get all available jobs (for testing)"""
    return {"jobs": MOCK_JOBS}

if __name__ == "__main__":
    print("Starting Job Recommendation ML API...")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    
    uvicorn.run(
        "ml-model-example:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )