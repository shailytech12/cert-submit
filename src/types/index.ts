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

// ML Model Related Types
export interface MLHealthStatus {
  status: 'healthy' | 'unhealthy' | 'unknown';
  message: string;
  lastChecked?: Date;
}

export interface ResumeParsingResult {
  skills: string[];
  experience: string[];
  education: string[];
  confidence: number;
}

export interface JobMatchResult {
  match_result: string;
  probability: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string;
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  match_score: number;
  salary_range: string;
  description: string;
}

export interface MLTestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}