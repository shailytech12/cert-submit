import React, { useState } from 'react';
import { RecruiterLayout } from '@/components/recruiter/RecruiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  User,
  Mail,
  Building,
  MapPin,
  Phone,
  Globe,
  Edit,
  Save,
  X,
  Upload,
  Lock,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock recruiter profile data
const mockProfile = {
  id: 'REC001',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@techcorp.com',
  phone: '+1 (555) 123-4567',
  company: 'TechCorp Solutions',
  position: 'Senior Technical Recruiter',
  department: 'Human Resources',
  location: 'San Francisco, CA',
  website: 'https://techcorp.com',
  bio: 'Experienced technical recruiter with 8+ years in the industry, specializing in software engineering and data science roles.',
  joinedDate: '2022-03-15',
  companySince: '2020-01-10',
  totalHires: 245,
  activeJobs: 12,
  logoUrl: null
};

export default function Profile() {
  const { logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [originalProfile, setOriginalProfile] = useState(mockProfile);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleEdit = () => {
    setOriginalProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Mock save functionality - in real app this would make an API call
    console.log('Saving profile:', profile);
    setIsEditing(false);
    // Show success message
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock file upload - in real app this would upload to server
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({ ...prev, logoUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Mock password change - in real app this would make an API call
    console.log('Changing password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordChange(false);
    // Show success message
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your recruiter profile and account settings
            </p>
          </div>
          <div className="flex space-x-3">
            {!isEditing ? (
              <Button onClick={handleEdit} className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex items-center space-x-2">
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profile.logoUrl ? (
                        <img src={profile.logoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <div>
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <label htmlFor="logo-upload">
                          <Button variant="outline" className="cursor-pointer flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>Upload Photo</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.position}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      {isEditing ? (
                        <Input
                          value={profile.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                        />
                      ) : (
                        <p className="text-gray-900">{profile.department}</p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profile.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Website
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    ) : (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {profile.website}
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-900">{formatDate(profile.joinedDate)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Since
                    </label>
                    <p className="text-gray-900">{formatDate(profile.companySince)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {!showPasswordChange ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Password</h3>
                      <p className="text-gray-600">Change your account password</p>
                    </div>
                    <Button 
                      onClick={() => setShowPasswordChange(true)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Change Password</span>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button type="submit">Update Password</Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setShowPasswordChange(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Hires</span>
                    <Badge variant="default">{profile.totalHires}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Jobs</span>
                    <Badge variant="secondary">{profile.activeJobs}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Profile ID</span>
                    <Badge variant="outline">{profile.id}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Privacy Settings</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center space-x-2 text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{profile.company}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                      {profile.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}