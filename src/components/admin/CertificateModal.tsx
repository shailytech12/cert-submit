import React, { useState } from 'react';
import { Certificate } from '../../types';
import { format } from 'date-fns';
import Button from '../ui/Button';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
  onVerify: (id: string, status: 'approved' | 'rejected', comments?: string) => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ 
  certificate, 
  onClose, 
  onVerify 
}) => {
  const [comments, setComments] = useState(certificate.adminComments || '');
  const [verificationStatus, setVerificationStatus] = useState<'approved' | 'rejected' | null>(null);

  const handleVerify = () => {
    if (verificationStatus) {
      onVerify(certificate.id, verificationStatus, comments);
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Certificate Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Certificate Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Certificate Name:</span>
                    <p className="text-sm text-gray-900">{certificate.certificateName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <p className="text-sm text-gray-900 capitalize">{certificate.certificateType}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Institution:</span>
                    <p className="text-sm text-gray-900">{certificate.institution}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Issue Date:</span>
                    <p className="text-sm text-gray-900">{format(certificate.issueDate, 'MMMM dd, yyyy')}</p>
                  </div>
                  {certificate.expiryDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Expiry Date:</span>
                      <p className="text-sm text-gray-900">{format(certificate.expiryDate, 'MMMM dd, yyyy')}</p>
                    </div>
                  )}
                  {certificate.grade && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Grade/Score:</span>
                      <p className="text-sm text-gray-900">{certificate.grade}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(certificate.status)} mt-1`}>
                      <span className="capitalize">{certificate.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-sm text-gray-900">{certificate.studentName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{certificate.studentEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Submitted:</span>
                    <p className="text-sm text-gray-900">{format(certificate.submittedAt, 'MMMM dd, yyyy HH:mm')}</p>
                  </div>
                  {certificate.verifiedAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Verified:</span>
                      <p className="text-sm text-gray-900">{format(certificate.verifiedAt, 'MMMM dd, yyyy HH:mm')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Certificate File Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Certificate File</h3>
              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">File: {certificate.fileName}</span>
                  <a
                    href={certificate.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500 text-sm"
                  >
                    Open in new tab
                  </a>
                </div>
                <div className="aspect-w-4 aspect-h-3">
                  {certificate.fileName.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={certificate.fileUrl}
                      className="w-full h-96 border-0"
                      title="Certificate PDF"
                    />
                  ) : (
                    <img
                      src={certificate.fileUrl}
                      alt="Certificate"
                      className="w-full h-96 object-contain border rounded"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          {certificate.status === 'pending' && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Verification</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                    Comments (optional)
                  </label>
                  <textarea
                    id="comments"
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add verification comments..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setVerificationStatus('approved')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      verificationStatus === 'approved'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setVerificationStatus('rejected')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      verificationStatus === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Previous Comments */}
          {certificate.adminComments && certificate.status !== 'pending' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Comments:</h4>
              <p className="text-sm text-gray-600">{certificate.adminComments}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {certificate.status === 'pending' && verificationStatus && (
              <Button onClick={handleVerify}>
                {verificationStatus === 'approved' ? 'Approve Certificate' : 'Reject Certificate'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;