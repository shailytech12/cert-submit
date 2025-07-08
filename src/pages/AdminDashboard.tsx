import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Certificate } from '../types';
import Button from '../components/ui/Button';
import AdminCertificateCard from '../components/admin/AdminCertificateCard';
import CertificateModal from '../components/admin/CertificateModal';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'certificates'));
      const certs: Certificate[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        certs.push({
          id: doc.id,
          ...data,
          issueDate: data.issueDate.toDate(),
          expiryDate: data.expiryDate?.toDate(),
          submittedAt: data.submittedAt.toDate(),
          verifiedAt: data.verifiedAt?.toDate(),
        } as Certificate);
      });
      
      setCertificates(certs.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()));
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCertificate = async (
    certificateId: string, 
    status: 'approved' | 'rejected', 
    comments?: string
  ) => {
    try {
      const certificateRef = doc(db, 'certificates', certificateId);
      await updateDoc(certificateRef, {
        status,
        adminComments: comments || null,
        verifiedBy: user?.id,
        verifiedAt: new Date(),
      });

      // Update local state
      setCertificates(prev =>
        prev.map(cert =>
          cert.id === certificateId
            ? {
                ...cert,
                status,
                adminComments: comments,
                verifiedBy: user?.id,
                verifiedAt: new Date(),
              }
            : cert
        )
      );

      toast.success(`Certificate ${status} successfully!`);
      setSelectedCertificate(null);
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast.error('Failed to update certificate');
    }
  };

  const getStatusCounts = () => {
    const approved = certificates.filter(cert => cert.status === 'approved').length;
    const pending = certificates.filter(cert => cert.status === 'pending').length;
    const rejected = certificates.filter(cert => cert.status === 'rejected').length;
    return { approved, pending, rejected, total: certificates.length };
  };

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'all') return true;
    return cert.status === filter;
  });

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CertifyPro</h1>
              <span className="ml-4 text-sm text-gray-500">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-medium">{statusCounts.total}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Certificates</dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-medium">{statusCounts.pending}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.pending}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-medium">{statusCounts.approved}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.approved}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-medium">{statusCounts.rejected}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                    <dd className="text-lg font-medium text-gray-900">{statusCounts.rejected}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
                className="capitalize"
              >
                {status === 'all' ? 'All' : status}
                {status === 'pending' && statusCounts.pending > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    {statusCounts.pending}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Certificates List */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">
            Certificate Verification Queue ({filteredCertificates.length})
          </h2>
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {filter === 'all' 
                  ? 'No certificates found.' 
                  : `No ${filter} certificates found.`
                }
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredCertificates.map((certificate) => (
                <AdminCertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onView={() => setSelectedCertificate(certificate)}
                  onVerify={handleVerifyCertificate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          onVerify={handleVerifyCertificate}
        />
      )}
    </div>
  );
};

export default AdminDashboard;