import React, { useState, useEffect } from 'react';
import { JobRecommendation } from '../../types';
import { profileService } from '../../lib/profileService';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import { toast } from 'sonner';

interface JobRecommendationsProps {
  onApplyJob?: (jobId: string) => void;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ onApplyJob }) => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user]);

  const fetchRecommendations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const recs = await profileService.getJobRecommendations(user.id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load job recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async (jobId: string) => {
    if (!user) return;

    try {
      await profileService.applyForJob(user.id, jobId);
      toast.success('Application submitted successfully!');
      if (onApplyJob) {
        onApplyJob(jobId);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const formatSalary = (salary?: { min: number; max: number; currency: string }) => {
    if (!salary) return 'Salary not specified';
    return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const getRecommendationTypeColor = (type: JobRecommendation['recommendationType']) => {
    const colors = {
      'ml-model': 'bg-purple-100 text-purple-800',
      'skill-match': 'bg-blue-100 text-blue-800',
      'location-match': 'bg-green-100 text-green-800',
      'experience-match': 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getRecommendationTypeLabel = (type: JobRecommendation['recommendationType']) => {
    const labels = {
      'ml-model': 'AI Recommended',
      'skill-match': 'Skills Match',
      'location-match': 'Location Match',
      'experience-match': 'Experience Match',
    };
    return labels[type] || 'Recommended';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Recommendations</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRecommendations}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          No job recommendations available yet.
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Complete your profile to get personalized job recommendations.
        </p>
        <Button onClick={fetchRecommendations} variant="outline">
          Refresh Recommendations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecommendations}
        >
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {recommendations.map((recommendation, index) => (
          <div
            key={`${recommendation.job.id}-${index}`}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {recommendation.job.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getRecommendationTypeColor(
                      recommendation.recommendationType
                    )}`}
                  >
                    {getRecommendationTypeLabel(recommendation.recommendationType)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="font-medium">{recommendation.job.company}</span>
                  <span>•</span>
                  <span>{recommendation.job.location}</span>
                  <span>•</span>
                  <span className="capitalize">{recommendation.job.type}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {Math.round(recommendation.score)}% Match
                </div>
                <div className="text-sm text-gray-500">
                  {formatSalary(recommendation.job.salary)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-700 text-sm line-clamp-3">
                {recommendation.job.description}
              </p>
            </div>

            {/* Skills */}
            {recommendation.matchingSkills.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Your Matching Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.matchingSkills.slice(0, 5).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {recommendation.matchingSkills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{recommendation.matchingSkills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Reasons */}
            {recommendation.reasons.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Why this job is recommended:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {recommendation.reasons.slice(0, 3).map((reason, reasonIndex) => (
                    <li key={reasonIndex} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job Requirements */}
            {recommendation.job.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Requirements:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recommendation.job.requirements.slice(0, 4).map((req, reqIndex) => (
                    <span
                      key={reqIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {req}
                    </span>
                  ))}
                  {recommendation.job.requirements.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{recommendation.job.requirements.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <span>Posted: {recommendation.job.postedDate.toLocaleDateString()}</span>
                {recommendation.job.isRemote && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                    Remote
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {recommendation.job.applicationUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(recommendation.job.applicationUrl, '_blank')}
                  >
                    View Details
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => handleApplyJob(recommendation.job.id)}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobRecommendations;