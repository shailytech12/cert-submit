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
  Plus,
  Search,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

// Mock data for grievances
const grievances = [
  {
    id: 'GRV001',
    title: 'Application Status Not Updated',
    category: 'Platform Issue',
    status: 'Open',
    priority: 'Medium',
    createdDate: '2024-01-20',
    description: 'Candidate application status has not been updated for over a week despite interview completion.',
    adminFeedback: null,
    resolvedDate: null
  },
  {
    id: 'GRV002',
    title: 'Duplicate Applications Received',
    category: 'Technical',
    status: 'In Progress',
    priority: 'High',
    createdDate: '2024-01-18',
    description: 'Multiple duplicate applications are being received from the same candidates.',
    adminFeedback: 'We are investigating this issue and will provide an update soon.',
    resolvedDate: null
  },
  {
    id: 'GRV003',
    title: 'Candidate Profile Missing Information',
    category: 'Data Quality',
    status: 'Closed',
    priority: 'Low',
    createdDate: '2024-01-15',
    description: 'Some candidate profiles are missing critical information like contact details.',
    adminFeedback: 'Issue has been resolved. Please refresh your browser and check again.',
    resolvedDate: '2024-01-17'
  },
  {
    id: 'GRV004',
    title: 'Interview Scheduling Conflicts',
    category: 'Process',
    status: 'Open',
    priority: 'High',
    createdDate: '2024-01-22',
    description: 'System is allowing double-booking of interview slots causing scheduling conflicts.',
    adminFeedback: null,
    resolvedDate: null
  },
  {
    id: 'GRV005',
    title: 'Email Notifications Not Working',
    category: 'Platform Issue',
    status: 'Closed',
    priority: 'Medium',
    createdDate: '2024-01-12',
    description: 'Not receiving email notifications for new applications and status updates.',
    adminFeedback: 'Email server issue has been fixed. Notifications should now work properly.',
    resolvedDate: '2024-01-14'
  }
];

const categories = ['Platform Issue', 'Technical', 'Data Quality', 'Process', 'Account', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

export default function Grievances() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showNewGrievanceForm, setShowNewGrievanceForm] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<typeof grievances[0] | null>(null);
  
  // New grievance form state
  const [newGrievance, setNewGrievance] = useState({
    title: '',
    category: '',
    priority: 'Medium',
    description: ''
  });

  const filteredGrievances = grievances.filter(grievance => {
    const matchesSearch = 
      grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || grievance.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || grievance.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return <Badge variant="destructive">Open</Badge>;
      case 'In Progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'Closed':
        return <Badge variant="success">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'High':
        return <Badge variant="warning">High</Badge>;
      case 'Medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - in real app this would make an API call
    console.log('Submitting grievance:', newGrievance);
    setNewGrievance({ title: '', category: '', priority: 'Medium', description: '' });
    setShowNewGrievanceForm(false);
    // Show success message or refresh data
  };

  const handleViewDetails = (grievance: typeof grievances[0]) => {
    setSelectedGrievance(grievance);
  };

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Grievances</h1>
            <p className="text-gray-600 mt-2">
              Manage complaints and issues related to the recruitment platform
            </p>
          </div>
          <Button 
            onClick={() => setShowNewGrievanceForm(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Raise New Grievance</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Grievances</p>
                  <p className="text-2xl font-bold text-gray-900">{grievances.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Issues</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {grievances.filter(g => g.status === 'Open').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {grievances.filter(g => g.status === 'In Progress').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {grievances.filter(g => g.status === 'Closed').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Grievance Form */}
        {showNewGrievanceForm && (
          <Card>
            <CardHeader>
              <CardTitle>Raise New Grievance</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitGrievance} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <Input
                      value={newGrievance.title}
                      onChange={(e) => setNewGrievance(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <Select 
                      value={newGrievance.category} 
                      onValueChange={(value) => setNewGrievance(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <Select 
                      value={newGrievance.priority} 
                      onValueChange={(value) => setNewGrievance(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map(priority => (
                          <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newGrievance.description}
                    onChange={(e) => setNewGrievance(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the issue..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit">Submit Grievance</Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowNewGrievanceForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filters and Grievances List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Grievances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search grievances by title or ID..."
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
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grievances Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grievance ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrievances.map((grievance) => (
                  <TableRow key={grievance.id}>
                    <TableCell className="font-medium">{grievance.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{grievance.title}</div>
                        <div className="text-sm text-gray-600 truncate">
                          {grievance.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{grievance.category}</TableCell>
                    <TableCell>{getStatusBadge(grievance.status)}</TableCell>
                    <TableCell>{getPriorityBadge(grievance.priority)}</TableCell>
                    <TableCell>{formatDate(grievance.createdDate)}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(grievance)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredGrievances.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No grievances found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grievance Details Modal */}
        {selectedGrievance && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grievance Details - {selectedGrievance.id}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedGrievance(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedGrievance.status)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Priority:</span>
                    <div className="mt-1">{getPriorityBadge(selectedGrievance.priority)}</div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Title:</span>
                  <p className="mt-1 text-gray-900">{selectedGrievance.title}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-900">{selectedGrievance.description}</p>
                </div>

                {selectedGrievance.adminFeedback && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Admin Feedback:</span>
                    <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-blue-900">{selectedGrievance.adminFeedback}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <div className="font-medium">{formatDate(selectedGrievance.createdDate)}</div>
                  </div>
                  {selectedGrievance.resolvedDate && (
                    <div>
                      <span className="text-gray-600">Resolved:</span>
                      <div className="font-medium">{formatDate(selectedGrievance.resolvedDate)}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </RecruiterLayout>
  );
}