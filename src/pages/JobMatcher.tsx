import React, { useState } from 'react';
import { mlService } from '../services/ml-service';
import type { JobMatchResult, MLTestResult } from '../types';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const JobMatcher: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    }
  };

  const handlePredictMatch = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description');
      return;
    }

    setIsMatching(true);
    setError(null);
    setMatchResult(null);

    try {
      const result: MLTestResult = await mlService.predictJobMatch(resumeFile, jobDescription);
      
      if (result.success && result.data) {
        setMatchResult(result.data);
      } else {
        setError(result.error || 'Failed to predict job match');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsMatching(false);
    }
  };

  const getMatchColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-600 bg-green-100';
    if (probability >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Matcher
          </h1>
          <p className="text-gray-600">
            Upload your resume and enter a job description to see how well they match
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="resume"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600">
                      {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, TXT (Max 10MB)
                    </span>
                  </div>
                </label>
              </div>
              {resumeFile && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 text-sm">Resume uploaded successfully</span>
                  </div>
                </div>
              )}
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Paste the job description here..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {jobDescription.length}/2000 characters
              </p>
            </div>
          </div>

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

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <Button
              onClick={handlePredictMatch}
              disabled={!resumeFile || !jobDescription.trim() || isMatching}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              {isMatching ? (
                <div className="flex items-center">
                  <LoadingSpinner />
                  <span className="ml-2">Analyzing Match...</span>
                </div>
              ) : (
                'Predict Match'
              )}
            </Button>
          </div>
        </div>

        {/* Match Results */}
        {matchResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Match Results</h2>
            
            {/* Overall Match */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">Overall Match</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(matchResult.probability)}`}>
                  {(matchResult.probability * 100).toFixed(1)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    matchResult.probability >= 0.8 ? 'bg-green-500' :
                    matchResult.probability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${matchResult.probability * 100}%` }}
                />
              </div>
              <p className="text-gray-700 mt-2">{matchResult.match_result}</p>
            </div>

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Matched Skills */}
              <div>
                <h3 className="font-medium text-green-700 mb-3">✅ Matched Skills</h3>
                {matchResult.matched_skills.length > 0 ? (
                  <div className="space-y-1">
                    {matchResult.matched_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No matching skills found</p>
                )}
              </div>

              {/* Missing Skills */}
              <div>
                <h3 className="font-medium text-red-700 mb-3">❌ Missing Skills</h3>
                {matchResult.missing_skills.length > 0 ? (
                  <div className="space-y-1">
                    {matchResult.missing_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No missing skills identified</p>
                )}
              </div>
            </div>

            {/* Recommendation */}
            {matchResult.recommendation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">💡 Recommendation</h3>
                <p className="text-blue-800">{matchResult.recommendation}</p>
              </div>
            )}
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
              onClick={() => window.location.href = '/job-recommendations'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Try Job Recommendations
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobMatcher;