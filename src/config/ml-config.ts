// ML Service Configuration
export interface MLServiceConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  endpoints: {
    health: string;
    parseResume: string;
    recommendBySkills: string;
    predictMatch: string;
  };
}

export const ENVIRONMENT_CONFIGS: Record<string, MLServiceConfig> = {
  development: {
    baseUrl: 'http://localhost:5000',
    timeout: 30000,
    retryAttempts: 3,
    endpoints: {
      health: '/health',
      parseResume: '/parse-resume',
      recommendBySkills: '/recommend-by-skills',
      predictMatch: '/predict-match',
    },
  },
  production: {
    baseUrl: process.env.VITE_ML_API_URL || 'http://localhost:5000',
    timeout: 30000,
    retryAttempts: 3,
    endpoints: {
      health: '/health',
      parseResume: '/parse-resume',
      recommendBySkills: '/recommend-by-skills',
      predictMatch: '/predict-match',
    },
  },
};

// Get current environment config
export const getCurrentMLConfig = (): MLServiceConfig => {
  const env = import.meta.env.MODE || 'development';
  return ENVIRONMENT_CONFIGS[env] || ENVIRONMENT_CONFIGS.development;
};

// Default ML API configuration
export const ML_CONFIG = getCurrentMLConfig();