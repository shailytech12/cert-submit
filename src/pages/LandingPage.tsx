import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CertifyPro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Certificate Verification
            <span className="block text-indigo-600">Made Simple</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your certificate verification process with our comprehensive platform. 
            Students can submit certificates for verification, and administrators can efficiently manage and approve them.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link to="/register">
                <Button size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Easy Submission</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Students can easily upload and submit their certificates for verification with detailed information.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Fast Verification</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Administrators can quickly review and verify certificates with comprehensive tools and status tracking.
              </p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Real-time Status</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Track verification status in real-time with instant notifications and detailed status updates.
              </p>
            </div>
          </div>
        </div>

        {/* ML Testing Section */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              ML Model Testing Tools
              <span className="block text-indigo-600 text-xl font-medium mt-2">Test Your ML Model Connection</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500">
              Comprehensive tools to test and validate your machine learning model connections for job matching and recommendations.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-blue-500">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Health Check</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Monitor ML service status and test all API endpoints with real-time health monitoring.
                </p>
                <Link to="/ml-health-check">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Check ML Health
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-green-500">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Job Matcher</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Upload resumes and test job matching algorithms with detailed match probability analysis.
                </p>
                <Link to="/job-matcher">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Test Job Matching
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-purple-500">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">Job Recommendations</h3>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Test personalized job recommendations based on extracted skills from resume parsing.
                </p>
                <Link to="/job-recommendations">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Get Recommendations
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-lg font-medium text-indigo-900">Getting Started</h4>
                <p className="text-indigo-700 text-sm mt-1">
                  Make sure your ML API is running on <code className="bg-indigo-100 px-2 py-1 rounded">http://localhost:5000</code> 
                  then start with the Health Check to verify connectivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;