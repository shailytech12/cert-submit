import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { User, Shield, Briefcase } from 'lucide-react';

// Mock users for testing different roles
const mockUsers = [
  {
    id: 'student-1',
    name: 'John Student',
    email: 'student@example.com',
    role: 'student' as const,
    description: 'Student Dashboard - Manage certificates and profile',
    icon: User,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
    description: 'Admin Dashboard - Certificate verification and user management',
    icon: Shield,
    color: 'bg-red-100 text-red-600'
  },
  {
    id: 'recruiter-1',
    name: 'Sarah Mitchell',
    email: 'recruiter@example.com',
    role: 'recruiter' as const,
    description: 'Recruiter Dashboard - Job posting and candidate management',
    icon: Briefcase,
    color: 'bg-green-100 text-green-600'
  }
];

export default function DemoPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (userRole: string) => {
    // Store the selected role in localStorage for demo purposes
    localStorage.setItem('demo-user-role', userRole);
    
    // Navigate to the appropriate dashboard
    switch (userRole) {
      case 'student':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/dashboard');
        break;
      case 'recruiter':
        navigate('/recruiter/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Platform Demo
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Choose a role to explore the different dashboards
          </p>
          <p className="text-sm text-gray-500">
            This demo page allows you to switch between different user roles to test the platform features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockUsers.map((user) => {
            const Icon = user.icon;
            return (
              <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${user.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl mb-2">{user.name}</CardTitle>
                  <Badge variant="secondary" className="mb-2">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4 text-sm">
                    {user.description}
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    {user.email}
                  </p>
                  <Button 
                    onClick={() => handleRoleSelect(user.role)}
                    className="w-full"
                  >
                    Enter as {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Demo Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold text-blue-600 mb-2">Student Dashboard</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Certificate management</li>
                    <li>• Profile editing</li>
                    <li>• Verification status</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Admin Dashboard</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Certificate verification</li>
                    <li>• User management</li>
                    <li>• System analytics</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-green-600 mb-2">Recruiter Dashboard</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Job posting management</li>
                    <li>• Candidate screening</li>
                    <li>• Application tracking</li>
                    <li>• Grievance handling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            Back to Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
}