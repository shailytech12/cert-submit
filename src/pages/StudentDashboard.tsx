import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Certificate } from '../types';
import Button from '../components/ui/Button';
import CertificateForm from '../components/forms/CertificateForm';
import CertificateCard from '../components/student/CertificateCard';
import { toast } from 'sonner';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'certificates'),
        where('studentId', '==', user.id)
      );
      const querySnapshot = await getDocs(q);
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

  const handleSubmitCertificate = async (formData: any) => {
    if (!user) return;
    
    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `certificates/${user.id}/${Date.now()}_${formData.file.name}`);
      await uploadBytes(fileRef, formData.file);
      const downloadURL = await getDownloadURL(fileRef);

      // Save certificate data to Firestore
      await addDoc(collection(db, 'certificates'), {
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        certificateName: formData.certificateName,
        certificateType: formData.certificateType,
        institution: formData.institution,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || null,
        grade: formData.grade || null,
        fileUrl: downloadURL,
        fileName: formData.file.name,
        status: 'pending',
        submittedAt: new Date(),
      });

      toast.success('Certificate submitted successfully!');
      setShowForm(false);
      fetchCertificates();
    } catch (error) {
      console.error('Error submitting certificate:', error);
      toast.error('Failed to submit certificate');
    }
  };

  const getStatusCounts = () => {
    const approved = certificates.filter(cert => cert.status === 'approved').length;
    const pending = certificates.filter(cert => cert.status === 'pending').length;
    const rejected = certificates.filter(cert => cert.status === 'rejected').length;
    return { approved, pending, rejected, total: certificates.length };
  };

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
              <span className="ml-4 text-sm text-gray-500">Student Dashboard</span>
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
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-medium">{statusCounts.pending}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
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

        {/* Action Button */}
        <div className="mb-6">
          <Button onClick={() => setShowForm(true)} size="lg">
            Submit New Certificate
          </Button>
        </div>

        {/* Certificate Form Modal */}
        {showForm && (
          <CertificateForm
            onSubmit={handleSubmitCertificate}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Certificates List */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Your Certificates</h2>
          {certificates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">No certificates submitted yet.</div>
              <Button 
                onClick={() => setShowForm(true)}
                className="mt-4"
              >
                Submit Your First Certificate
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificates.map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;