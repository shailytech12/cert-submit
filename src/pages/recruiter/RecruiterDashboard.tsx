import React from 'react';
import { RecruiterLayout } from '@/components/recruiter/RecruiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp,
  Github,
  Linkedin,
  Mail,
  Star
} from 'lucide-react';

// Mock data for candidate cards
const candidateCards = [
  {
    id: 'C1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    college: 'MIT',
    skills: ['React', 'TypeScript', 'Node.js'],
    cgpa: 8.7,
    resumeScore: 92,
    github: 'alexjohnson',
    linkedin: 'alex-johnson-dev'
  },
  {
    id: 'C2',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    college: 'Stanford',
    skills: ['Python', 'Machine Learning', 'AWS'],
    cgpa: 9.1,
    resumeScore: 88,
    github: 'sarahchen',
    linkedin: 'sarah-chen-ml'
  },
  {
    id: 'C3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    college: 'UC Berkeley',
    skills: ['Java', 'Spring Boot', 'Microservices'],
    cgpa: 8.4,
    resumeScore: 85,
    github: 'michaelbrown',
    linkedin: 'michael-brown-java'
  },
  {
    id: 'C4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    college: 'Harvard',
    skills: ['React Native', 'Flutter', 'Firebase'],
    cgpa: 8.9,
    resumeScore: 90,
    github: 'emilydavis',
    linkedin: 'emily-davis-mobile'
  },
  {
    id: 'C5',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    college: 'CMU',
    skills: ['DevOps', 'Kubernetes', 'Docker'],
    cgpa: 8.2,
    resumeScore: 87,
    github: 'davidwilson',
    linkedin: 'david-wilson-devops'
  },
  {
    id: 'C6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    college: 'Caltech',
    skills: ['Data Science', 'Python', 'TensorFlow'],
    cgpa: 9.3,
    resumeScore: 94,
    github: 'lisagarcia',
    linkedin: 'lisa-garcia-ds'
  },
];

const dashboardStats = [
  {
    title: 'Total Candidates',
    value: '1,247',
    icon: Users,
    change: '+12%',
    changeType: 'positive'
  },
  {
    title: 'Active Jobs',
    value: '23',
    icon: Briefcase,
    change: '+5%',
    changeType: 'positive'
  },
  {
    title: 'Applications',
    value: '456',
    icon: FileText,
    change: '+18%',
    changeType: 'positive'
  },
  {
    title: 'Placement Rate',
    value: '87%',
    icon: TrendingUp,
    change: '+3%',
    changeType: 'positive'
  },
];

function CandidateCard({ candidate }: { candidate: typeof candidateCards[0] }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{candidate.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{candidate.college}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {candidate.id}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Contact Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{candidate.email}</span>
          </div>
          
          {/* Skills */}
          <div>
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">CGPA</span>
              <div className="font-semibold">{candidate.cgpa}</div>
            </div>
            <div>
              <span className="text-gray-600">Resume Score</span>
              <div className="font-semibold flex items-center">
                {candidate.resumeScore}
                <Star className="w-3 h-3 ml-1 text-yellow-500" />
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-3">
            <a 
              href={`https://github.com/${candidate.github}`}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <Github className="w-4 h-4" />
              <span className="text-xs">GitHub</span>
            </a>
            <a 
              href={`https://linkedin.com/in/${candidate.linkedin}`}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <Linkedin className="w-4 h-4" />
              <span className="text-xs">LinkedIn</span>
            </a>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button size="sm" className="flex-1">
              Shortlist
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RecruiterDashboard() {
  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's an overview of your recruitment activities.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Candidate Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recommended Candidates
              </h2>
              <p className="text-gray-600">
                Top candidates matching your active job requirements
              </p>
            </div>
            <Button>View All Candidates</Button>
          </div>

          {/* Candidate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidateCards.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}