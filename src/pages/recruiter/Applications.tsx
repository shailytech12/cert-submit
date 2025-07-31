import React, { useState } from 'react';
import { RecruiterLayout } from '@/components/recruiter/RecruiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/Table';
import { 
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Mail,
  FileText
} from 'lucide-react';

// Mock data for applications
const applications = [
  {
    id: 'APP001',
    candidateName: 'Alex Johnson',
    candidateEmail: 'alex.johnson@email.com',
    jobTitle: 'Senior React Developer',
    jobId: 'JOB001',
    status: 'Submitted',
    appliedDate: '2024-01-20',
    interviewDate: null,
    skills: ['React', 'TypeScript', 'Node.js'],
    experience: '3 years',
    location: 'San Francisco, CA'
  },
  {
    id: 'APP002',
    candidateName: 'Sarah Chen',
    candidateEmail: 'sarah.chen@email.com',
    jobTitle: 'Data Scientist',
    jobId: 'JOB003',
    status: 'Shortlisted',
    appliedDate: '2024-01-18',
    interviewDate: '2024-01-25',
    skills: ['Python', 'Machine Learning', 'AWS'],
    experience: '4 years',
    location: 'Seattle, WA'
  },
  {
    id: 'APP003',
    candidateName: 'Michael Brown',
    candidateEmail: 'michael.brown@email.com',
    jobTitle: 'Product Manager',
    jobId: 'JOB002',
    status: 'Interview Scheduled',
    appliedDate: '2024-01-17',
    interviewDate: '2024-01-24',
    skills: ['Product Strategy', 'Analytics', 'Leadership'],
    experience: '5 years',
    location: 'New York, NY'
  },
  {
    id: 'APP004',
    candidateName: 'Emily Davis',
    candidateEmail: 'emily.davis@email.com',
    jobTitle: 'UX Designer',
    jobId: 'JOB004',
    status: 'Submitted',
    appliedDate: '2024-01-21',
    interviewDate: null,
    skills: ['UI/UX', 'Figma', 'User Research'],
    experience: '2 years',
    location: 'Austin, TX'
  },
  {
    id: 'APP005',
    candidateName: 'David Wilson',
    candidateEmail: 'david.wilson@email.com',
    jobTitle: 'DevOps Engineer',
    jobId: 'JOB005',
    status: 'Rejected',
    appliedDate: '2024-01-15',
    interviewDate: null,
    skills: ['Docker', 'Kubernetes', 'AWS'],
    experience: '3 years',
    location: 'Remote'
  },
  {
    id: 'APP006',
    candidateName: 'Lisa Garcia',
    candidateEmail: 'lisa.garcia@email.com',
    jobTitle: 'Senior React Developer',
    jobId: 'JOB001',
    status: 'Interview Scheduled',
    appliedDate: '2024-01-19',
    interviewDate: '2024-01-26',
    skills: ['React', 'Vue.js', 'GraphQL'],
    experience: '4 years',
    location: 'San Francisco, CA'
  },
];

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('All');

  // Get unique skills for filter
  const allSkills = Array.from(new Set(applications.flatMap(app => app.skills)));

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSkill = skillFilter === 'All' || app.skills.includes(skillFilter);
    return matchesSearch && matchesStatus && matchesSkill;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'Shortlisted':
        return <Badge variant="warning">Shortlisted</Badge>;
      case 'Interview Scheduled':
        return <Badge variant="default">Interview Scheduled</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const exportApplications = () => {
    // Mock export functionality
    const csvContent = [
      'Application ID,Candidate Name,Email,Job Title,Status,Applied Date,Interview Date',
      ...filteredApplications.map(app => 
        `${app.id},${app.candidateName},${app.candidateEmail},${app.jobTitle},${app.status},${app.appliedDate},${app.interviewDate || 'N/A'}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'applications.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="text-gray-600 mt-2">
              View and manage all job applications from candidates
            </p>
          </div>
          <Button onClick={exportApplications} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
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
                    {applications.filter(app => app.status === 'Shortlisted').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <User className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'Interview Scheduled').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New This Week</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Application Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by candidate name, job title, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Skills</SelectItem>
                  {allSkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Applications Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Interview Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.candidateName}</div>
                        <div className="text-sm text-gray-600">{app.candidateEmail}</div>
                        <div className="text-xs text-gray-500">{app.experience} experience</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.jobTitle}</div>
                        <div className="text-sm text-gray-600">{app.jobId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>{formatDate(app.appliedDate)}</TableCell>
                    <TableCell>
                      {app.interviewDate ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span>{formatDate(app.interviewDate)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {app.status === 'Submitted' && (
                          <Button size="sm">
                            Shortlist
                          </Button>
                        )}
                        {app.status === 'Shortlisted' && (
                          <Button size="sm">
                            Schedule
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredApplications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RecruiterLayout>
  );
}