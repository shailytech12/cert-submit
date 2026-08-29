import React, { useState, useEffect } from 'react';
import { Job } from '../../types';
import { jobApiService } from '../../lib/jobApi';
import { profileService } from '../../lib/profileService';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'sonner';

const JobSearch: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: '',
    jobType: '',
    experience: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (page = 1, append = false) => {
    try {
      setLoading(true);
      
      const searchResults = await jobApiService.searchJobs({
        ...searchParams,
        page,
        limit: 20,
      });

      if (append) {
        setJobs(prev => [...prev, ...searchResults]);
      } else {
        setJobs(searchResults);
      }

      setHasMore(searchResults.length === 20);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching jobs:', error);
      toast.error('Failed to search jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    handleSearch(currentPage + 1, true);
  };

  const handleApplyJob = async (jobId: string) => {
    if (!user) return;

    try {
      await profileService.applyForJob(user.id, jobId);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Salary not specified';
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const getJobTypeColor = (type: Job['type']) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800',
      'remote': 'bg-indigo-100 text-indigo-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Jobs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title or Keywords
            </label>
            <input
              type="text"
              value={searchParams.query}
              onChange={(e) => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
              placeholder="e.g. Software Engineer, Marketing"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={searchParams.location}
              onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. New York, Remote"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              value={searchParams.jobType}
              onChange={(e) => setSearchParams(prev => ({ ...prev, jobType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              value={searchParams.experience}
              onChange={(e) => setSearchParams(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => handleSearch(1, false)}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSearchParams({ query: '', location: '', jobType: '', experience: '' });
              setJobs([]);
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Results */}
      <div>
        {jobs.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Found {jobs.length} jobs
          </div>
        )}

        {loading && jobs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <span className="font-medium">{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="capitalize">{job.experience} level</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatSalary(job.salary)}
                    </div>
                    <div className="mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getJobTypeColor(job.type)}`}>
                        {job.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {job.description}
                  </p>
                </div>

                {/* Skills */}
                {job.skills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Required Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 6 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{job.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {job.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Requirements:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.requirements.slice(0, 3).map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                      {job.requirements.length > 3 && (
                        <li className="text-gray-500 text-xs">
                          +{job.requirements.length - 3} more requirements
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>Posted: {job.postedDate.toLocaleDateString()}</span>
                    {job.isRemote && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                        Remote
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                      {job.source}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {job.applicationUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(job.applicationUrl, '_blank')}
                      >
                        View Details
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleApplyJob(job.id)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More */}
            {hasMore && jobs.length > 0 && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Jobs'}
                </Button>
              </div>
            )}

            {jobs.length === 0 && !loading && (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  No jobs found matching your criteria.
                </div>
                <p className="text-sm text-gray-400">
                  Try adjusting your search filters or keywords.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;