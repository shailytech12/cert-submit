import React, { useState } from 'react';
import { RecruiterLayout } from '@/components/recruiter/RecruiterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/Table';
import { 
  Plus,
  Search,
  Eye,
  Edit,
  X,
  Calendar,
  Users
} from 'lucide-react';

// Mock data for job opportunities
const jobOpportunities = [
  {
    id: 'JOB001',
    title: 'Senior React Developer',
    status: 'Active',
    applicationsCount: 45,
    postedDate: '2024-01-15',
    location: 'San Francisco, CA',
    type: 'Full-time',
    department: 'Engineering'
  },
  {
    id: 'JOB002',
    title: 'Product Manager',
    status: 'Active',
    applicationsCount: 32,
    postedDate: '2024-01-12',
    location: 'New York, NY',
    type: 'Full-time',
    department: 'Product'
  },
  {
    id: 'JOB003',
    title: 'Data Scientist',
    status: 'Closed',
    applicationsCount: 67,
    postedDate: '2024-01-08',
    location: 'Seattle, WA',
    type: 'Full-time',
    department: 'Data Science'
  },
  {
    id: 'JOB004',
    title: 'UX Designer',
    status: 'Active',
    applicationsCount: 23,
    postedDate: '2024-01-20',
    location: 'Austin, TX',
    type: 'Full-time',
    department: 'Design'
  },
  {
    id: 'JOB005',
    title: 'DevOps Engineer',
    status: 'Active',
    applicationsCount: 18,
    postedDate: '2024-01-18',
    location: 'Remote',
    type: 'Full-time',
    department: 'Engineering'
  },
  {
    id: 'JOB006',
    title: 'Marketing Specialist',
    status: 'Draft',
    applicationsCount: 0,
    postedDate: '2024-01-22',
    location: 'Boston, MA',
    type: 'Part-time',
    department: 'Marketing'
  },
];

export default function OpportunitiesPosted() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredJobs = jobOpportunities.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'Closed':
        return <Badge variant="secondary">Closed</Badge>;
      case 'Draft':
        return <Badge variant="warning">Draft</Badge>;
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

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Opportunities Posted</h1>
            <p className="text-gray-600 mt-2">
              Manage all your job postings and track applications
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobOpportunities.filter(job => job.status === 'Active').length}
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
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobOpportunities.reduce((sum, job) => sum + job.applicationsCount, 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobOpportunities.filter(job => job.status === 'Draft').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Edit className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Job Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by title or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                {['All', 'Active', 'Closed', 'Draft'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Jobs Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Posted Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-600">{job.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{job.applicationsCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(job.postedDate)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{job.location}</div>
                        <div className="text-xs text-gray-600">{job.type}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {job.status === 'Active' && (
                          <Button size="sm" variant="ghost">
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredJobs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No jobs found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RecruiterLayout>
  );
}