import React, { useState, useEffect } from 'react';
import { StudentProfile, EducationEntry, WorkExperience } from '../../types';
import { profileService } from '../../lib/profileService';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'sonner';

const ProfileSetup: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'preferences'>('basic');

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    skills: [] as string[],
    interests: [] as string[],
    bio: '',
    experience: 'entry' as const,
  });

  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [preferences, setPreferences] = useState({
    preferredJobTypes: [] as string[],
    preferredLocations: [] as string[],
    salaryExpectation: {
      min: 0,
      max: 0,
      currency: 'USD',
    },
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const existingProfile = await profileService.getStudentProfile(user.id);
      
      if (existingProfile) {
        setProfile(existingProfile);
        setBasicInfo({
          skills: existingProfile.skills,
          interests: existingProfile.interests,
          bio: existingProfile.bio || '',
          experience: existingProfile.experience,
        });
        setWorkExperience(existingProfile.workExperience);
        setEducation(existingProfile.education);
        setPreferences({
          preferredJobTypes: existingProfile.preferredJobTypes,
          preferredLocations: existingProfile.preferredLocations,
          salaryExpectation: existingProfile.salaryExpectation || {
            min: 0,
            max: 0,
            currency: 'USD',
          },
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      setSaving(true);
      
      const profileData: Partial<StudentProfile> = {
        ...basicInfo,
        workExperience,
        education,
        ...preferences,
      };

      if (profile) {
        await profileService.updateStudentProfile(user.id, profileData);
      } else {
        await profileService.createStudentProfile(user.id, profileData);
      }

      toast.success('Profile saved successfully!');
      await loadProfile(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !basicInfo.skills.includes(newSkill.trim())) {
      setBasicInfo(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setBasicInfo(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !basicInfo.interests.includes(newInterest.trim())) {
      setBasicInfo(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setBasicInfo(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));
  };

  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: new Date(),
      isCurrently: false,
      description: '',
      skills: [],
    };
    setWorkExperience(prev => [...prev, newWork]);
  };

  const updateWorkExperience = (id: string, updates: Partial<WorkExperience>) => {
    setWorkExperience(prev =>
      prev.map(work => work.id === id ? { ...work, ...updates } : work)
    );
  };

  const removeWorkExperience = (id: string) => {
    setWorkExperience(prev => prev.filter(work => work.id !== id));
  };

  const addEducation = () => {
    const newEdu: EducationEntry = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: new Date(),
      isCurrently: false,
    };
    setEducation(prev => [...prev, newEdu]);
  };

  const updateEducation = (id: string, updates: Partial<EducationEntry>) => {
    setEducation(prev =>
      prev.map(edu => edu.id === id ? { ...edu, ...updates } : edu)
    );
  };

  const removeEducation = (id: string) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
  };

  const getProfileCompleteness = () => {
    if (!profile) return { score: 0, suggestions: [] };
    return profileService.getProfileCompleteness(profile);
  };

  const completeness = getProfileCompleteness();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Profile Setup</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Profile Completeness: <span className="font-medium">{completeness.score}%</span>
            </div>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completeness.score}%` }}
              />
            </div>
          </div>
        </div>

        {completeness.suggestions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Complete your profile to get better job recommendations:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {completeness.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'basic', label: 'Basic Info' },
              { id: 'experience', label: 'Work Experience' },
              { id: 'education', label: 'Education' },
              { id: 'preferences', label: 'Job Preferences' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={basicInfo.bio}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={basicInfo.experience}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, experience: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={addSkill} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {basicInfo.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center"
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
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  placeholder="Add an interest..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={addInterest} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {basicInfo.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md flex items-center"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Job Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Job Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['full-time', 'part-time', 'contract', 'internship', 'remote'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.preferredJobTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences(prev => ({
                            ...prev,
                            preferredJobTypes: [...prev.preferredJobTypes, type],
                          }));
                        } else {
                          setPreferences(prev => ({
                            ...prev,
                            preferredJobTypes: prev.preferredJobTypes.filter(t => t !== type),
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="capitalize">{type.replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Expectation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Expectation (Annual)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                  <input
                    type="number"
                    value={preferences.salaryExpectation.min}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      salaryExpectation: {
                        ...prev.salaryExpectation,
                        min: parseInt(e.target.value) || 0,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                  <input
                    type="number"
                    value={preferences.salaryExpectation.max}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      salaryExpectation: {
                        ...prev.salaryExpectation,
                        max: parseInt(e.target.value) || 0,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Currency</label>
                  <select
                    value={preferences.salaryExpectation.currency}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      salaryExpectation: {
                        ...prev.salaryExpectation,
                        currency: e.target.value,
                      },
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add similar sections for experience and education tabs */}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveProfile}
          disabled={saving}
          size="lg"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSetup;