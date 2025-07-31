import React, { useState } from 'react';
import { RecruiterLayout } from '@/components/recruiter/RecruiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Search,
  Filter,
  Star,
  Github,
  Linkedin,
  Mail,
  MapPin,
  GraduationCap,
  User,
  Heart,
  X
} from 'lucide-react';

// Extended mock data for candidates
const candidates = [
  {
    id: 'C1',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    college: 'MIT',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    cgpa: 8.7,
    resumeScore: 92,
    github: 'alexjohnson',
    linkedin: 'alex-johnson-dev',
    location: 'San Francisco, CA',
    experience: '3 years',
    status: 'Available',
    appliedJobs: 2,
    shortlisted: false
  },
  {
    id: 'C2',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    college: 'Stanford',
    skills: ['Python', 'Machine Learning', 'AWS', 'TensorFlow'],
    cgpa: 9.1,
    resumeScore: 88,
    github: 'sarahchen',
    linkedin: 'sarah-chen-ml',
    location: 'Seattle, WA',
    experience: '4 years',
    status: 'Available',
    appliedJobs: 1,
    shortlisted: true
  },
  {
    id: 'C3',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    college: 'UC Berkeley',
    skills: ['Java', 'Spring Boot', 'Microservices', 'PostgreSQL'],
    cgpa: 8.4,
    resumeScore: 85,
    github: 'michaelbrown',
    linkedin: 'michael-brown-java',
    location: 'New York, NY',
    experience: '5 years',
    status: 'In Interview',
    appliedJobs: 3,
    shortlisted: true
  },
  {
    id: 'C4',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    college: 'Harvard',
    skills: ['React Native', 'Flutter', 'Firebase', 'UI/UX'],
    cgpa: 8.9,
    resumeScore: 90,
    github: 'emilydavis',
    linkedin: 'emily-davis-mobile',
    location: 'Austin, TX',
    experience: '2 years',
    status: 'Available',
    appliedJobs: 1,
    shortlisted: false
  },
  {
    id: 'C5',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    college: 'CMU',
    skills: ['DevOps', 'Kubernetes', 'Docker', 'Jenkins'],
    cgpa: 8.2,
    resumeScore: 87,
    github: 'davidwilson',
    linkedin: 'david-wilson-devops',
    location: 'Remote',
    experience: '3 years',
    status: 'Available',
    appliedJobs: 2,
    shortlisted: false
  },
  {
    id: 'C6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    college: 'Caltech',
    skills: ['Data Science', 'Python', 'TensorFlow', 'SQL'],
    cgpa: 9.3,
    resumeScore: 94,
    github: 'lisagarcia',
    linkedin: 'lisa-garcia-ds',
    location: 'Los Angeles, CA',
    experience: '4 years',
    status: 'Hired',
    appliedJobs: 1,
    shortlisted: true
  },
];

function CandidateCard({ candidate, onShortlist, onReject }: { 
  candidate: typeof candidates[0], 
  onShortlist: (id: string) => void,
  onReject: (id: string) => void 
}) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge variant="success">Available</Badge>;
      case 'In Interview':
        return <Badge variant="warning">In Interview</Badge>;
      case 'Hired':
        return <Badge variant="default">Hired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{candidate.name}</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <GraduationCap className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{candidate.college}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className="text-xs">
              {candidate.id}
            </Badge>
            {candidate.shortlisted && (
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Contact & Location */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{candidate.location}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            {getStatusBadge(candidate.status)}
          </div>
          
          {/* Skills */}
          <div>
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {candidate.skills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 4} more
                </Badge>
              )}
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

          {/* Experience */}
          <div className="text-sm">
            <span className="text-gray-600">Experience: </span>
            <span className="font-medium">{candidate.experience}</span>
          </div>

          {/* Applied Jobs */}
          <div className="text-sm">
            <span className="text-gray-600">Applied to: </span>
            <span className="font-medium">{candidate.appliedJobs} jobs</span>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-3">
            <a 
              href={`https://github.com/${candidate.github}`}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              <span className="text-xs">GitHub</span>
            </a>
            <a 
              href={`https://linkedin.com/in/${candidate.linkedin}`}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-4 h-4" />
              <span className="text-xs">LinkedIn</span>
            </a>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            {!candidate.shortlisted ? (
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onShortlist(candidate.id)}
              >
                Shortlist
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                disabled
              >
                Shortlisted
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onReject(candidate.id)}
            >
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Candidates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('resumeScore');
  const [candidatesList, setCandidatesList] = useState(candidates);

  // Get unique skills and statuses for filters
  const allSkills = Array.from(new Set(candidates.flatMap(candidate => candidate.skills)));
  const allStatuses = Array.from(new Set(candidates.map(candidate => candidate.status)));

  const handleShortlist = (candidateId: string) => {
    setCandidatesList(prev => 
      prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, shortlisted: true }
          : candidate
      )
    );
  };

  const handleReject = (candidateId: string) => {
    // In a real app, this might change status or remove from view
    console.log('Rejecting candidate:', candidateId);
  };

  const filteredCandidates = candidatesList.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSkill = skillFilter === 'All' || candidate.skills.includes(skillFilter);
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    return matchesSearch && matchesSkill && matchesStatus;
  });

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortBy) {
      case 'resumeScore':
        return b.resumeScore - a.resumeScore;
      case 'cgpa':
        return b.cgpa - a.cgpa;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="text-gray-600 mt-2">
              Browse and manage candidate profiles from your talent pool
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {candidatesList.filter(c => c.shortlisted).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {candidates.filter(c => c.status === 'Available').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <User className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(candidates.reduce((sum, c) => sum + c.resumeScore, 0) / candidates.length)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, college, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  {allStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resumeScore">Resume Score</SelectItem>
                  <SelectItem value="cgpa">CGPA</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCandidates.map((candidate) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate}
                  onShortlist={handleShortlist}
                  onReject={handleReject}
                />
              ))}
            </div>

            {sortedCandidates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No candidates found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RecruiterLayout>
  );
}