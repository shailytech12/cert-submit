import React, { useState, useEffect } from 'react';
import { mlService } from '../services/ml-service';
import type { MLHealthStatus, MLTestResult } from '../types';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const MLHealthCheck: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<MLHealthStatus>({
    status: 'unknown',
    message: 'Not checked yet',
  });
  const [isChecking, setIsChecking] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, MLTestResult>>({});
  const [customEndpoint, setCustomEndpoint] = useState('http://localhost:5000');
  const [isTestingFunction, setIsTestingFunction] = useState<Record<string, boolean>>({});

  // Check health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const status = await mlService.checkHealth();
      setHealthStatus(status);
      console.log('ML Service Health:', status);
    } catch (error) {
      console.error('Health check error:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const updateApiEndpoint = () => {
    mlService.setApiEndpoint(customEndpoint);
    checkHealth();
  };

  const testFunction = async (functionName: string, testFn: () => Promise<MLTestResult>) => {
    setIsTestingFunction(prev => ({ ...prev, [functionName]: true }));
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [functionName]: result }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [functionName]: {
          success: false,
          message: '❌ Test failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      }));
    } finally {
      setIsTestingFunction(prev => ({ ...prev, [functionName]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ML Model Connection Health Check
          </h1>
          <p className="text-gray-600">
            Test your ML model connection and verify all endpoints are working correctly
          </p>
        </div>

        {/* API Endpoint Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">
                ML API Endpoint
              </label>
              <input
                id="endpoint"
                type="text"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="http://localhost:5000"
              />
            </div>
            <Button onClick={updateApiEndpoint} className="bg-blue-600 hover:bg-blue-700">
              Update & Test
            </Button>
          </div>
        </div>

        {/* Health Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Connection Status</h2>
            <Button 
              onClick={checkHealth} 
              disabled={isChecking}
              className="bg-gray-600 hover:bg-gray-700"
            >
              {isChecking ? 'Checking...' : 'Check Again'}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(healthStatus.status)}`}>
              {healthStatus.status.toUpperCase()}
            </div>
            <span className="text-gray-700">{healthStatus.message}</span>
            {healthStatus.lastChecked && (
              <span className="text-gray-500 text-sm">
                Last checked: {healthStatus.lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>

          {healthStatus.status === 'healthy' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 font-medium">✅ Connected!</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your ML model is running and responding correctly.
              </p>
            </div>
          )}

          {healthStatus.status !== 'healthy' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">❌ Connection Failed</span>
              </div>
              <p className="text-red-600 text-sm mt-1">
                Unable to reach your ML service. Please check if it's running on the correct port.
              </p>
            </div>
          )}
        </div>

        {/* Function Tests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Function Tests</h2>
          <div className="space-y-4">
            
            {/* Resume Parsing Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Resume Parsing</h3>
                <Button
                  onClick={() => testFunction('resumeParsing', mlService.testResumeParsingFunction.bind(mlService))}
                  disabled={isTestingFunction.resumeParsing}
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  {isTestingFunction.resumeParsing ? <LoadingSpinner /> : 'Test Resume Parsing'}
                </Button>
              </div>
              <p className="text-gray-600 text-sm mb-2">Tests the /parse-resume endpoint</p>
              {testResults.resumeParsing && (
                <div className={`p-3 rounded ${testResults.resumeParsing.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <p className="font-medium">{testResults.resumeParsing.message}</p>
                  {testResults.resumeParsing.error && (
                    <p className="text-sm mt-1">Error: {testResults.resumeParsing.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Job Recommendations Test */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Job Recommendations</h3>
                <Button
                  onClick={() => testFunction('jobRecommendations', mlService.testJobRecommendations.bind(mlService))}
                  disabled={isTestingFunction.jobRecommendations}
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  {isTestingFunction.jobRecommendations ? <LoadingSpinner /> : 'Test Recommendations'}
                </Button>
              </div>
              <p className="text-gray-600 text-sm mb-2">Tests the /recommend-by-skills endpoint</p>
              {testResults.jobRecommendations && (
                <div className={`p-3 rounded ${testResults.jobRecommendations.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  <p className="font-medium">{testResults.jobRecommendations.message}</p>
                  {testResults.jobRecommendations.error && (
                    <p className="text-sm mt-1">Error: {testResults.jobRecommendations.error}</p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Job Matcher</h3>
              <p className="text-gray-600 text-sm mb-3">
                Upload a resume and test job matching functionality
              </p>
              <Button 
                onClick={() => window.location.href = '/job-matcher'} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Go to Job Matcher
              </Button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">Job Recommendations</h3>
              <p className="text-gray-600 text-sm mb-3">
                Test personalized job recommendations
              </p>
              <Button 
                onClick={() => window.location.href = '/job-recommendations'} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Go to Recommendations
              </Button>
            </div>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">💡 Troubleshooting Tips</h2>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Make sure your ML API is running on the correct port (default: 5000)</li>
            <li>• Check that CORS is properly configured in your ML service</li>
            <li>• Verify all required endpoints exist: /health, /parse-resume, /recommend-by-skills, /predict-match</li>
            <li>• Look at the browser console (F12) for detailed error messages</li>
            <li>• Test your API directly: <code>curl http://localhost:5000/health</code></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default MLHealthCheck;