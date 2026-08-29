import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  addDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { 
  StudentProfile, 
  JobApplication, 
  MLRecommendationRequest, 
  Certificate,
  JobRecommendation 
} from '../types';
import { jobApiService } from './jobApi';

class ProfileService {
  // Get or create student profile
  async getStudentProfile(userId: string): Promise<StudentProfile | null> {
    try {
      const profileDoc = await getDoc(doc(db, 'studentProfiles', userId));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          education: data.education?.map((edu: any) => ({
            ...edu,
            startDate: edu.startDate.toDate(),
            endDate: edu.endDate?.toDate(),
          })) || [],
          workExperience: data.workExperience?.map((work: any) => ({
            ...work,
            startDate: work.startDate.toDate(),
            endDate: work.endDate?.toDate(),
          })) || [],
          resume: data.resume ? {
            ...data.resume,
            uploadedAt: data.resume.uploadedAt.toDate(),
          } : undefined,
        } as StudentProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  }

  // Create initial student profile
  async createStudentProfile(userId: string, initialData: Partial<StudentProfile>): Promise<StudentProfile> {
    try {
      const profile: StudentProfile = {
        id: userId,
        userId,
        skills: initialData.skills || [],
        interests: initialData.interests || [],
        experience: initialData.experience || 'entry',
        preferredJobTypes: initialData.preferredJobTypes || ['full-time'],
        preferredLocations: initialData.preferredLocations || [],
        salaryExpectation: initialData.salaryExpectation,
        bio: initialData.bio,
        education: initialData.education || [],
        workExperience: initialData.workExperience || [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...initialData,
      };

      await setDoc(doc(db, 'studentProfiles', userId), profile);
      return profile;
    } catch (error) {
      console.error('Error creating student profile:', error);
      throw error;
    }
  }

  // Update student profile
  async updateStudentProfile(userId: string, updates: Partial<StudentProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'studentProfiles', userId), {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  }

  // Upload resume
  async uploadResume(userId: string, file: File): Promise<{ url: string; fileName: string }> {
    try {
      const fileRef = ref(storage, `resumes/${userId}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      // Update profile with resume info
      await this.updateStudentProfile(userId, {
        resume: {
          url,
          fileName: file.name,
          uploadedAt: new Date(),
        },
      });

      return { url, fileName: file.name };
    } catch (error) {
      console.error('Error uploading resume:', error);
      throw error;
    }
  }

  // Get job recommendations for a student
  async getJobRecommendations(userId: string): Promise<JobRecommendation[]> {
    try {
      const profile = await this.getStudentProfile(userId);
      if (!profile) {
        throw new Error('Student profile not found');
      }

      // Get student's certificates to include in recommendation request
      const certificates = await this.getStudentCertificates(userId);
      
      // Build ML recommendation request
      const mlRequest: MLRecommendationRequest = {
        studentId: userId,
        skills: profile.skills,
        experience: profile.experience,
        preferences: {
          jobTypes: profile.preferredJobTypes,
          locations: profile.preferredLocations,
          salaryRange: profile.salaryExpectation ? {
            min: profile.salaryExpectation.min,
            max: profile.salaryExpectation.max,
          } : undefined,
        },
        certificates: certificates.map(cert => ({
          type: cert.certificateType,
          skills: this.extractSkillsFromCertificate(cert),
        })),
      };

      // Get recommendations from ML model
      return await jobApiService.getMLRecommendations(mlRequest);
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      throw error;
    }
  }

  // Get student's certificates
  private async getStudentCertificates(userId: string): Promise<Certificate[]> {
    try {
      const q = query(
        collection(db, 'certificates'),
        where('studentId', '==', userId),
        where('status', '==', 'approved')
      );
      
      const querySnapshot = await getDocs(q);
      const certificates: Certificate[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        certificates.push({
          id: doc.id,
          ...data,
          issueDate: data.issueDate.toDate(),
          expiryDate: data.expiryDate?.toDate(),
          submittedAt: data.submittedAt.toDate(),
          verifiedAt: data.verifiedAt?.toDate(),
        } as Certificate);
      });
      
      return certificates;
    } catch (error) {
      console.error('Error fetching student certificates:', error);
      return [];
    }
  }

  // Extract skills from certificate (you can enhance this with NLP or predefined mappings)
  private extractSkillsFromCertificate(certificate: Certificate): string[] {
    const skillMappings: Record<string, string[]> = {
      'programming': ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js'],
      'data science': ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Pandas'],
      'web development': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Node.js'],
      'mobile development': ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin'],
      'cloud computing': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
      'cybersecurity': ['Network Security', 'Penetration Testing', 'Cryptography', 'Risk Assessment'],
      'project management': ['Agile', 'Scrum', 'Project Planning', 'Risk Management'],
      'digital marketing': ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Analytics'],
    };

    const certificateType = certificate.certificateType.toLowerCase();
    const certificateName = certificate.certificateName.toLowerCase();
    
    // Find matching skills based on certificate type and name
    for (const [category, skills] of Object.entries(skillMappings)) {
      if (certificateType.includes(category) || certificateName.includes(category)) {
        return skills;
      }
    }

    // If no specific mapping found, extract from certificate name
    return this.extractSkillsFromText(certificate.certificateName);
  }

  private extractSkillsFromText(text: string): string[] {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'HTML', 'CSS',
      'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
      'Machine Learning', 'Data Science', 'AI', 'Analytics', 'Statistics',
      'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'
    ];

    return commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }

  // Apply for a job
  async applyForJob(userId: string, jobId: string): Promise<JobApplication> {
    try {
      const job = await jobApiService.getJobById(jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      const application: Omit<JobApplication, 'id'> = {
        studentId: userId,
        jobId,
        job,
        status: 'applied',
        appliedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'jobApplications'), application);
      
      return {
        id: docRef.id,
        ...application,
      };
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  }

  // Get student's job applications
  async getJobApplications(userId: string): Promise<JobApplication[]> {
    try {
      const q = query(
        collection(db, 'jobApplications'),
        where('studentId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const applications: JobApplication[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        applications.push({
          id: doc.id,
          ...data,
          appliedAt: data.appliedAt.toDate(),
          interviewDate: data.interviewDate?.toDate(),
          followUpDate: data.followUpDate?.toDate(),
        } as JobApplication);
      });
      
      return applications.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  }

  // Update job application status
  async updateJobApplication(applicationId: string, updates: Partial<JobApplication>): Promise<void> {
    try {
      await updateDoc(doc(db, 'jobApplications', applicationId), updates);
    } catch (error) {
      console.error('Error updating job application:', error);
      throw error;
    }
  }

  // Generate profile completeness score
  getProfileCompleteness(profile: StudentProfile): { score: number; suggestions: string[] } {
    let score = 0;
    const suggestions: string[] = [];
    const maxScore = 100;

    // Basic info (20 points)
    if (profile.skills.length > 0) {
      score += 10;
    } else {
      suggestions.push('Add your skills to help us recommend better jobs');
    }

    if (profile.bio) {
      score += 10;
    } else {
      suggestions.push('Add a bio to showcase your personality');
    }

    // Experience (20 points)
    if (profile.workExperience.length > 0) {
      score += 20;
    } else {
      suggestions.push('Add your work experience');
    }

    // Education (20 points)
    if (profile.education.length > 0) {
      score += 20;
    } else {
      suggestions.push('Add your education background');
    }

    // Preferences (20 points)
    if (profile.preferredJobTypes.length > 0) {
      score += 10;
    } else {
      suggestions.push('Set your preferred job types');
    }

    if (profile.preferredLocations.length > 0) {
      score += 10;
    } else {
      suggestions.push('Add your preferred work locations');
    }

    // Resume (20 points)
    if (profile.resume) {
      score += 20;
    } else {
      suggestions.push('Upload your resume');
    }

    return { score: Math.round(score), suggestions };
  }
}

export const profileService = new ProfileService();