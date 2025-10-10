import React, { useState, useEffect } from 'react';
import { JobApplication } from '../../types';
import { profileService } from '../../lib/profileService';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'sonner';

const JobApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<JobApplication['status'] | 'all'>('all');

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const apps = await profileService.getJobApplications(user.id);
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load job applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: JobApplication['status']) => {
    try {
      await profileService.updateJobApplication(applicationId, { status });
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? { ...app, status } : app)
      );
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    }
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const getStatusColor = (status: JobApplication['status']) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-purple-100 text-purple-800',
      offered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusCounts = () => {
    const counts = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      interview: applications.filter(app => app.status === 'interview').length,
      offered: applications.filter(app => app.status === 'offered').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Applications</h2>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.applied}</div>
            <div className="text-sm text-gray-500">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{statusCounts.interview}</div>
            <div className="text-sm text-gray-500">Interview</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.offered}</div>
            <div className="text-sm text-gray-500">Offered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex space-x-2">
          {[
            { value: 'all', label: 'All Applications' },
            { value: 'applied', label: 'Applied' },
            { value: 'viewed', label: 'Viewed' },
            { value: 'interview', label: 'Interview' },
            { value: 'offered', label: 'Offered' },
            { value: 'rejected', label: 'Rejected' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === option.value
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-500 mb-4">
            {filter === 'all' ? 'No job applications yet.' : `No ${filter} applications.`}
          </div>
          <p className="text-sm text-gray-400">
            Start applying for jobs to track your applications here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {application.job.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span className="font-medium">{application.job.company}</span>
                    <span>•</span>
                    <span>{application.job.location}</span>
                    <span>•</span>
                    <span className="capitalize">{application.job.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    Applied: {application.appliedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-4">
                <p className="text-gray-700 text-sm line-clamp-2">
                  {application.job.description}
                </p>
              </div>

              {/* Interview Date */}
              {application.interviewDate && (
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                  <div className="text-sm font-medium text-purple-800">
                    Interview Scheduled: {application.interviewDate.toLocaleDateString()} at {application.interviewDate.toLocaleTimeString()}
                  </div>
                </div>
              )}

              {/* Notes */}
              {application.notes && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="text-sm text-gray-700">{application.notes}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  {application.status === 'applied' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'viewed')}
                      >
                        Mark as Viewed
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'interview')}
                      >
                        Schedule Interview
                      </Button>
                    </>
                  )}
                  {application.status === 'interview' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'offered')}
                      >
                        Mark as Offered
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      >
                        Mark as Rejected
                      </Button>
                    </>
                  )}
                  {['applied', 'viewed', 'interview'].includes(application.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateApplicationStatus(application.id, 'withdrawn')}
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  {application.job.applicationUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(application.job.applicationUrl, '_blank')}
                    >
                      View Job
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;