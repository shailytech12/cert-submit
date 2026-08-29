export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  createdAt: Date;
  avatar?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  certificateName: string;
  issueDate: Date;
  expiryDate?: Date;
  fileUrl: string;
  fileName: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComments?: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  submittedAt: Date;
  certificateType: string;
  institution: string;
  grade?: string;
}

export interface CertificateSubmission {
  certificateName: string;
  certificateType: string;
  institution: string;
  issueDate: Date;
  expiryDate?: Date;
  grade?: string;
  file: File;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'student' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
}

export interface DashboardStats {
  totalCertificates: number;
  approvedCertificates: number;
  pendingCertificates: number;
  rejectedCertificates: number;
}

// Job-related interfaces
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  experience: 'entry' | 'mid' | 'senior' | 'executive';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  skills: string[];
  benefits?: string[];
  postedDate: Date;
  applicationDeadline?: Date;
  companyLogo?: string;
  isRemote: boolean;
  applicationUrl?: string;
  source: string; // API source identifier
}

export interface StudentProfile {
  id: string;
  userId: string;
  skills: string[];
  interests: string[];
  experience: 'entry' | 'mid' | 'senior';
  preferredJobTypes: ('full-time' | 'part-time' | 'contract' | 'internship' | 'remote')[];
  preferredLocations: string[];
  salaryExpectation?: {
    min: number;
    max: number;
    currency: string;
  };
  resume?: {
    url: string;
    fileName: string;
    uploadedAt: Date;
  };
  bio?: string;
  education: EducationEntry[];
  workExperience: WorkExperience[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  isCurrently: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  isCurrently: boolean;
  description: string;
  skills: string[];
}

export interface JobApplication {
  id: string;
  studentId: string;
  jobId: string;
  job: Job;
  status: 'applied' | 'viewed' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
  appliedAt: Date;
  notes?: string;
  interviewDate?: Date;
  followUpDate?: Date;
}

export interface JobRecommendation {
  job: Job;
  score: number;
  reasons: string[];
  matchingSkills: string[];
  recommendationType: 'ml-model' | 'skill-match' | 'location-match' | 'experience-match';
}

export interface MLRecommendationRequest {
  studentId: string;
  skills: string[];
  experience: string;
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryRange?: {
      min: number;
      max: number;
    };
  };
  certificates: {
    type: string;
    skills: string[];
  }[];
}

export interface MLRecommendationResponse {
  recommendations: {
    jobId: string;
    score: number;
    reasons: string[];
  }[];
  modelVersion: string;
  timestamp: Date;
}