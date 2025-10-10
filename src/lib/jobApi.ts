import { Job, JobRecommendation, MLRecommendationRequest, MLRecommendationResponse, StudentProfile } from '../types';

// Configuration for different job portal APIs
const JOB_API_CONFIG = {
  // You can add multiple job portal APIs here
  ADZUNA: {
    baseUrl: 'https://api.adzuna.com/v1/api/jobs',
    appId: process.env.VITE_ADZUNA_APP_ID || '',
    appKey: process.env.VITE_ADZUNA_APP_KEY || '',
  },
  JOBS_API: {
    baseUrl: 'https://jobs-api.example.com/v1', // Replace with your job portal API
    apiKey: process.env.VITE_JOBS_API_KEY || '',
  },
  ML_MODEL: {
    baseUrl: process.env.VITE_ML_MODEL_URL || 'http://localhost:8000', // Your ML model endpoint
    apiKey: process.env.VITE_ML_API_KEY || '',
  }
};

class JobApiService {
  private async makeRequest(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Search jobs from multiple sources
  async searchJobs(params: {
    query?: string;
    location?: string;
    jobType?: string;
    experience?: string;
    page?: number;
    limit?: number;
  }): Promise<Job[]> {
    const jobs: Job[] = [];

    // Search from your job portal API
    try {
      const jobPortalJobs = await this.searchJobsFromPortal(params);
      jobs.push(...jobPortalJobs);
    } catch (error) {
      console.error('Error fetching from job portal:', error);
    }

    // Search from Adzuna (example external API)
    try {
      const adzunaJobs = await this.searchJobsFromAdzuna(params);
      jobs.push(...adzunaJobs);
    } catch (error) {
      console.error('Error fetching from Adzuna:', error);
    }

    return jobs;
  }

  private async searchJobsFromPortal(params: any): Promise<Job[]> {
    const { baseUrl, apiKey } = JOB_API_CONFIG.JOBS_API;
    
    const queryParams = new URLSearchParams({
      q: params.query || '',
      location: params.location || '',
      type: params.jobType || '',
      experience: params.experience || '',
      page: (params.page || 1).toString(),
      limit: (params.limit || 20).toString(),
    });

    const url = `${baseUrl}/jobs/search?${queryParams}`;
    
    const data = await this.makeRequest(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return data.jobs?.map(this.transformJobPortalJob) || [];
  }

  private async searchJobsFromAdzuna(params: any): Promise<Job[]> {
    const { baseUrl, appId, appKey } = JOB_API_CONFIG.ADZUNA;
    
    if (!appId || !appKey) {
      return []; // Skip if credentials not provided
    }

    const country = 'us'; // You can make this configurable
    const queryParams = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      what: params.query || '',
      where: params.location || '',
      results_per_page: (params.limit || 20).toString(),
      page: (params.page || 1).toString(),
    });

    const url = `${baseUrl}/${country}/search/1?${queryParams}`;
    
    const data = await this.makeRequest(url);
    return data.results?.map(this.transformAdzunaJob) || [];
  }

  // Transform job data from your job portal API to our Job interface
  private transformJobPortalJob(apiJob: any): Job {
    return {
      id: apiJob.id,
      title: apiJob.title,
      company: apiJob.company?.name || apiJob.company,
      location: apiJob.location,
      type: this.normalizeJobType(apiJob.type),
      experience: this.normalizeExperience(apiJob.experience_level),
      salary: apiJob.salary ? {
        min: apiJob.salary.min,
        max: apiJob.salary.max,
        currency: apiJob.salary.currency || 'USD',
      } : undefined,
      description: apiJob.description,
      requirements: apiJob.requirements || [],
      skills: apiJob.skills || [],
      benefits: apiJob.benefits || [],
      postedDate: new Date(apiJob.posted_date),
      applicationDeadline: apiJob.deadline ? new Date(apiJob.deadline) : undefined,
      companyLogo: apiJob.company?.logo,
      isRemote: apiJob.remote || false,
      applicationUrl: apiJob.application_url,
      source: 'job-portal',
    };
  }

  // Transform job data from Adzuna API to our Job interface
  private transformAdzunaJob(apiJob: any): Job {
    return {
      id: `adzuna_${apiJob.id}`,
      title: apiJob.title,
      company: apiJob.company?.display_name || 'Unknown Company',
      location: apiJob.location?.display_name || '',
      type: 'full-time', // Adzuna doesn't always specify, default to full-time
      experience: 'entry', // Default experience level
      salary: apiJob.salary_min && apiJob.salary_max ? {
        min: apiJob.salary_min,
        max: apiJob.salary_max,
        currency: 'USD',
      } : undefined,
      description: apiJob.description || '',
      requirements: [],
      skills: [],
      benefits: [],
      postedDate: new Date(apiJob.created),
      companyLogo: apiJob.company?.logo,
      isRemote: apiJob.title?.toLowerCase().includes('remote') || false,
      applicationUrl: apiJob.redirect_url,
      source: 'adzuna',
    };
  }

  // Get job recommendations from ML model
  async getMLRecommendations(request: MLRecommendationRequest): Promise<JobRecommendation[]> {
    const { baseUrl, apiKey } = JOB_API_CONFIG.ML_MODEL;
    
    try {
      const response = await this.makeRequest(`${baseUrl}/recommend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
      });

      const mlResponse: MLRecommendationResponse = response;
      
      // Fetch job details for recommended job IDs
      const jobs = await this.getJobsByIds(mlResponse.recommendations.map(r => r.jobId));
      
      return mlResponse.recommendations.map(rec => {
        const job = jobs.find(j => j.id === rec.jobId);
        if (!job) return null;
        
        return {
          job,
          score: rec.score,
          reasons: rec.reasons,
          matchingSkills: this.findMatchingSkills(job.skills, request.skills),
          recommendationType: 'ml-model' as const,
        };
      }).filter(Boolean) as JobRecommendation[];
    } catch (error) {
      console.error('Error getting ML recommendations:', error);
      // Fallback to rule-based recommendations
      return this.getRuleBasedRecommendations(request);
    }
  }

  // Fallback rule-based recommendations when ML model is unavailable
  private async getRuleBasedRecommendations(request: MLRecommendationRequest): Promise<JobRecommendation[]> {
    const jobs = await this.searchJobs({
      query: request.skills.join(' '),
      limit: 50,
    });

    return jobs
      .map(job => ({
        job,
        score: this.calculateRuleBasedScore(job, request),
        reasons: this.generateReasons(job, request),
        matchingSkills: this.findMatchingSkills(job.skills, request.skills),
        recommendationType: 'skill-match' as const,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  private calculateRuleBasedScore(job: Job, request: MLRecommendationRequest): number {
    let score = 0;
    
    // Skill matching (40% weight)
    const matchingSkills = this.findMatchingSkills(job.skills, request.skills);
    score += (matchingSkills.length / Math.max(job.skills.length, 1)) * 40;
    
    // Experience level matching (20% weight)
    if (job.experience === request.experience) {
      score += 20;
    }
    
    // Job type preference (20% weight)
    if (request.preferences.jobTypes.includes(job.type)) {
      score += 20;
    }
    
    // Location preference (10% weight)
    if (request.preferences.locations.some(loc => 
      job.location.toLowerCase().includes(loc.toLowerCase())
    )) {
      score += 10;
    }
    
    // Salary range (10% weight)
    if (job.salary && request.preferences.salaryRange) {
      const jobAvgSalary = (job.salary.min + job.salary.max) / 2;
      const prefAvgSalary = (request.preferences.salaryRange.min + request.preferences.salaryRange.max) / 2;
      const salaryDiff = Math.abs(jobAvgSalary - prefAvgSalary) / prefAvgSalary;
      score += Math.max(0, 10 - salaryDiff * 10);
    }
    
    return Math.min(100, score);
  }

  private generateReasons(job: Job, request: MLRecommendationRequest): string[] {
    const reasons: string[] = [];
    
    const matchingSkills = this.findMatchingSkills(job.skills, request.skills);
    if (matchingSkills.length > 0) {
      reasons.push(`Matches ${matchingSkills.length} of your skills: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    
    if (job.experience === request.experience) {
      reasons.push(`Perfect match for your ${request.experience} experience level`);
    }
    
    if (request.preferences.jobTypes.includes(job.type)) {
      reasons.push(`Matches your preferred job type: ${job.type}`);
    }
    
    return reasons;
  }

  private findMatchingSkills(jobSkills: string[], userSkills: string[]): string[] {
    return jobSkills.filter(skill => 
      userSkills.some(userSkill => 
        skill.toLowerCase().includes(userSkill.toLowerCase()) ||
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  private async getJobsByIds(jobIds: string[]): Promise<Job[]> {
    // This would typically make API calls to fetch jobs by their IDs
    // For now, we'll return empty array as a placeholder
    return [];
  }

  private normalizeJobType(type: string): Job['type'] {
    const normalizedType = type?.toLowerCase() || '';
    
    if (normalizedType.includes('full')) return 'full-time';
    if (normalizedType.includes('part')) return 'part-time';
    if (normalizedType.includes('contract')) return 'contract';
    if (normalizedType.includes('intern')) return 'internship';
    if (normalizedType.includes('remote')) return 'remote';
    
    return 'full-time'; // default
  }

  private normalizeExperience(experience: string): Job['experience'] {
    const normalizedExp = experience?.toLowerCase() || '';
    
    if (normalizedExp.includes('senior') || normalizedExp.includes('lead')) return 'senior';
    if (normalizedExp.includes('mid') || normalizedExp.includes('intermediate')) return 'mid';
    if (normalizedExp.includes('entry') || normalizedExp.includes('junior')) return 'entry';
    if (normalizedExp.includes('executive') || normalizedExp.includes('director')) return 'executive';
    
    return 'entry'; // default
  }

  // Get job details by ID
  async getJobById(jobId: string): Promise<Job | null> {
    try {
      const [source, id] = jobId.split('_');
      
      if (source === 'adzuna') {
        // Fetch from Adzuna
        return await this.getAdzunaJobById(id);
      } else {
        // Fetch from your job portal
        return await this.getJobPortalJobById(jobId);
      }
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return null;
    }
  }

  private async getJobPortalJobById(jobId: string): Promise<Job | null> {
    const { baseUrl, apiKey } = JOB_API_CONFIG.JOBS_API;
    
    const data = await this.makeRequest(`${baseUrl}/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    return data ? this.transformJobPortalJob(data) : null;
  }

  private async getAdzunaJobById(jobId: string): Promise<Job | null> {
    // Adzuna doesn't have a direct job by ID endpoint in their free tier
    // You might need to implement caching or use their paid tier
    return null;
  }
}

export const jobApiService = new JobApiService();