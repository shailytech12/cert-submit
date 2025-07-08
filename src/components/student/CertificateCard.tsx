import React from 'react';
import { Certificate } from '../../types';
import { format } from 'date-fns';

interface CertificateCardProps {
  certificate: Certificate;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {certificate.certificateName}
          </h3>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(certificate.status)}`}>
            {getStatusIcon(certificate.status)}
            <span className="ml-1 capitalize">{certificate.status}</span>
          </div>
        </div>

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

        {certificate.adminComments && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Admin Comments:</span> {certificate.adminComments}
            </p>
          </div>
        )}

        <div className="mt-4">
          <a
            href={certificate.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Certificate
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;