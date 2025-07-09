import React, { useState } from 'react';
import Button from '../ui/Button';

interface CertificateFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    certificateName: '',
    certificateType: '',
    institution: '',
    issueDate: '',
    expiryDate: '',
    grade: '',
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      alert('Please select a certificate file');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        issueDate: new Date(formData.issueDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
      });
    } catch (error) {
      console.error('Error submitting certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Submit Certificate</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="certificateName" className="block text-sm font-medium text-gray-700">
                Certificate Name *
              </label>
              <input
                type="text"
                id="certificateName"
                name="certificateName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter certificate name"
                value={formData.certificateName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="certificateType" className="block text-sm font-medium text-gray-700">
                Certificate Type *
              </label>
              <select
                id="certificateType"
                name="certificateType"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.certificateType}
                onChange={handleChange}
              >
                <option value="">Select certificate type</option>
                <option value="degree">Degree</option>
                <option value="diploma">Diploma</option>
                <option value="course">Course Completion</option>
                <option value="professional">Professional Certification</option>
                <option value="skill">Skill Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution/Organization *
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter institution name"
                value={formData.institution}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
                  Issue Date *
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
                Grade/Score (optional)
              </label>
              <input
                type="text"
                id="grade"
                name="grade"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter grade or score"
                value={formData.grade}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                Certificate File *
              </label>
              <input
                type="file"
                id="file"
                name="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleFileChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Accepted formats: PDF, JPG, PNG (Max size: 10MB)
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Certificate'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CertificateForm;