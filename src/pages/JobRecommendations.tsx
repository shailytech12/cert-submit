import React, { useState } from 'react';
import { mlService } from '../services/ml-service';
import type { JobRecommendation, ResumeParsingResult, MLTestResult } from '../types';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const JobRecommendations: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGettingRecommendations, setIsGettingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'skills' | 'recommendations'>('upload');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setResumeFile(file);
      setError(null);
      setStep('upload');
      setExtractedSkills([]);
      setRecommendations([]);
    }
  };

  const parseResume = async () => {
    if (!resumeFile) {
      setError('Please upload a resume first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result: MLTestResult = await mlService.parseResume(resumeFile);
      
      if (result.success && result.data) {
        const parseResult: ResumeParsingResult = result.data;
        setExtractedSkills(parseResult.skills || []);
        setStep('skills');
      } else {
        setError(result.error || 'Failed to parse resume');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRecommendations = async (skills: string[]) => {
    if (skills.length === 0) {
      setError('No skills available for recommendations');
      return;
    }

    setIsGettingRecommendations(true);
    setError(null);

    try {
      const result: MLTestResult = await mlService.getRecommendationsBySkills(skills, 10);
      
      if (result.success && result.data) {
        setRecommendations(result.data);
        setStep('recommendations');
      } else {
        setError(result.error || 'Failed to get job recommendations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsGettingRecommendations(false);
    }
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !extractedSkills.includes(skill.trim())) {
      setExtractedSkills([...extractedSkills, skill.trim()]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setExtractedSkills(extractedSkills.filter(skill => skill !== skillToRemove));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Recommendations
          </h1>
          <p className="text-gray-600">
            Upload your resume to get personalized job recommendations based on your skills
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'upload' ? 'text-blue-600' : step !== 'upload' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-blue-600 text-white' : step !== 'upload' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step !== 'upload' ? '✓' : '1'}
              </div>
              <span className="ml-2 font-medium">Upload Resume</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded">
              <div className={`h-1 rounded transition-all duration-300 ${step !== 'upload' ? 'bg-green-500 w-full' : 'bg-gray-300 w-0'}`}></div>
            </div>
            <div className={`flex items-center ${step === 'skills' ? 'text-blue-600' : step === 'recommendations' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'skills' ? 'bg-blue-600 text-white' : step === 'recommendations' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step === 'recommendations' ? '✓' : '2'}
              </div>
              <span className="ml-2 font-medium">Extract Skills</span>
            </div>
            <div className="w-16 h-1 bg-gray-300 rounded">
              <div className={`h-1 rounded transition-all duration-300 ${step === 'recommendations' ? 'bg-green-500 w-full' : 'bg-gray-300 w-0'}`}></div>
            </div>
            <div className={`flex items-center ${step === 'recommendations' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'recommendations' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step === 'recommendations' ? '✓' : '3'}
              </div>
              <span className="ml-2 font-medium">Get Recommendations</span>
            </div>
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        {step === 'upload' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                id="resume"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              <label htmlFor="resume" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-lg text-gray-600 mb-2">
                    {resumeFile ? resumeFile.name : 'Click to upload or drag and drop your resume'}
                  </span>
                  <span className="text-sm text-gray-500">
                    PDF, DOC, DOCX, TXT (Max 10MB)
                  </span>
                </div>
              </label>
            </div>

            {resumeFile && (
              <div className="mt-6 text-center">
                <Button
                  onClick={parseResume}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <LoadingSpinner />
                      <span className="ml-2">Parsing Resume...</span>
                    </div>
                  ) : (
                    'Extract Skills from Resume'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Skills Review */}
        {step === 'skills' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Review and Edit Your Skills</h2>
            <p className="text-gray-600 mb-4">
              We extracted the following skills from your resume. You can add or remove skills to get better recommendations.
            </p>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {extractedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {extractedSkills.length === 0 && (
                <p className="text-gray-500 text-sm mb-4">
                  No skills were automatically extracted. Please add some skills manually.
                </p>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill (e.g., JavaScript, Project Management)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                    if (input?.value) {
                      addSkill(input.value);
                      input.value = '';
                    }
                  }}
                  className="bg-gray-600 hover:bg-gray-700"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => getRecommendations(extractedSkills)}
                disabled={extractedSkills.length === 0 || isGettingRecommendations}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
              >
                {isGettingRecommendations ? (
                  <div className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">Finding Jobs...</span>
                  </div>
                ) : (
                  `Get Recommendations (${extractedSkills.length} skills)`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Job Recommendations */}
        {step === 'recommendations' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Personalized Job Recommendations ({recommendations.length})
              </h2>
              <Button
                onClick={() => setStep('skills')}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Edit Skills
              </Button>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid gap-6">
                {recommendations.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-gray-500 text-sm">{job.location}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(job.match_score)}`}>
                          {job.match_score}% Match
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{job.salary_range}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {job.location}
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations found</h3>
                <p className="text-gray-600">Try adding more skills or check your ML service connection.</p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="space-x-4">
            <Button
              onClick={() => window.location.href = '/ml-health-check'}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Back to Health Check
            </Button>
            <Button
              onClick={() => window.location.href = '/job-matcher'}
              className="bg-green-600 hover:bg-green-700"
            >
              Try Job Matcher
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobRecommendations;