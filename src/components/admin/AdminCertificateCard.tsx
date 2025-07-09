import React from 'react';
import { Certificate } from '../../types';
import { format } from 'date-fns';
import Button from '../ui/Button';

interface AdminCertificateCardProps {
  certificate: Certificate;
  onView: () => void;
  onVerify: (id: string, status: 'approved' | 'rejected', comments?: string) => void;
}

const AdminCertificateCard: React.FC<AdminCertificateCardProps> = ({ 
  certificate, 
  onView, 
  onVerify 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {certificate.certificateName}
            </h3>
            <p className="text-sm text-gray-500">
              Submitted by: {certificate.studentName} ({certificate.studentEmail})
            </p>
          </div>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(certificate.status)}`}>
            <span className="capitalize">{certificate.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Type:</span>
              <span className="text-gray-900 capitalize">{certificate.certificateType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Institution:</span>
              <span className="text-gray-900">{certificate.institution}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Issue Date:</span>
              <span className="text-gray-900">{format(certificate.issueDate, 'MMM dd, yyyy')}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {certificate.grade && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Grade:</span>
                <span className="text-gray-900">{certificate.grade}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Submitted:</span>
              <span className="text-gray-900">{format(certificate.submittedAt, 'MMM dd, yyyy')}</span>
            </div>
            {certificate.verifiedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Verified:</span>
                <span className="text-gray-900">{format(certificate.verifiedAt, 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>
        </div>

        {certificate.adminComments && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Previous Comments:</span> {certificate.adminComments}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" onClick={onView}>
            View Details
          </Button>
          
          <a
            href={certificate.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Certificate
          </a>

          {certificate.status === 'pending' && (
            <>
              <Button
                variant="default"
                onClick={() => onVerify(certificate.id, 'approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => onVerify(certificate.id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCertificateCard;