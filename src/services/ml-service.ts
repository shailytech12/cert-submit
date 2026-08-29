import { ML_CONFIG } from '../config/ml-config';
import type { MLHealthStatus, ResumeParsingResult, JobMatchResult, JobRecommendation, MLTestResult } from '../types';

class MLService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = ML_CONFIG.baseUrl;
    this.timeout = ML_CONFIG.timeout;
  }

  // Update base URL dynamically
  setApiEndpoint(url: string) {
    this.baseUrl = url;
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Health Check
  async checkHealth(): Promise<MLHealthStatus> {
    try {
      const response = await this.makeRequest(ML_CONFIG.endpoints.health);
      
      if (!response.ok) {
        return {
          status: 'unhealthy',
          message: `ML service responded with ${response.status}`,
          lastChecked: new Date(),
        };
      }

      const data = await response.json();
      return {
        status: data.status === 'healthy' ? 'healthy' : 'unhealthy',
        message: data.message || 'ML service is running',
        lastChecked: new Date(),
      };
    } catch (error) {
      console.error('ML Health Check Error:', error);
      return {
        status: 'unknown',
        message: error instanceof Error ? error.message : 'Connection failed',
        lastChecked: new Date(),
      };
    }
  }

  // Resume Parsing
  async parseResume(file: File): Promise<MLTestResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}${ML_CONFIG.endpoints.parseResume}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to parse resume: ${response.statusText}`);
      }

      const data: ResumeParsingResult = await response.json();
      return {
        success: true,
        message: `✅ Resume parsing works! Extracted ${data.skills.length} skills`,
        data,
      };
    } catch (error) {
      console.error('Resume Parsing Error:', error);
      return {
        success: false,
        message: '❌ Resume parsing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Job Recommendations by Skills
  async getRecommendationsBySkills(skills: string[], limit = 10): Promise<MLTestResult> {
    try {
      const response = await this.makeRequest(ML_CONFIG.endpoints.recommendBySkills, {
        method: 'POST',
        body: JSON.stringify({ skills, limit }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get recommendations: ${response.statusText}`);
      }

      const data: JobRecommendation[] = await response.json();
      return {
        success: true,
        message: `✅ Job recommendations work! Found ${data.length} jobs`,
        data,
      };
    } catch (error) {
      console.error('Job Recommendations Error:', error);
      return {
        success: false,
        message: '❌ Job recommendations failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Job Match Prediction
  async predictJobMatch(resumeFile: File, jobDescription: string): Promise<MLTestResult> {
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jobDescription);

      const response = await fetch(`${this.baseUrl}${ML_CONFIG.endpoints.predictMatch}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to predict job match: ${response.statusText}`);
      }

      const data: JobMatchResult = await response.json();
      return {
        success: true,
        message: `✅ Job matching works! Match probability: ${(data.probability * 100).toFixed(1)}%`,
        data,
      };
    } catch (error) {
      console.error('Job Match Prediction Error:', error);
      return {
        success: false,
        message: '❌ Job matching failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Test Resume Parsing (with dummy file if needed)
  async testResumeParsingFunction(): Promise<MLTestResult> {
    try {
      // Create a dummy text file for testing
      const dummyContent = 'John Doe\nSoftware Engineer\nSkills: JavaScript, React, Node.js\nExperience: 3 years web development';
      const dummyFile = new File([dummyContent], 'test-resume.txt', { type: 'text/plain' });
      
      return await this.parseResume(dummyFile);
    } catch (error) {
      return {
        success: false,
        message: '❌ Resume parsing test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Test Job Recommendations
  async testJobRecommendations(): Promise<MLTestResult> {
    try {
      const testSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript'];
      return await this.getRecommendationsBySkills(testSkills, 5);
    } catch (error) {
      return {
        success: false,
        message: '❌ Job recommendations test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const mlService = new MLService();