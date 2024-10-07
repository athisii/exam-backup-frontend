import React, { useState, ChangeEvent } from 'react';
import { toast } from 'sonner';

interface BulkUploadModalProps {
  onClose: () => void;
  onSubmit: (bulkData: File) => Promise<void>; // onSubmit expects a file to be processed
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Handle form submission for bulk upload
  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(selectedFile); // Pass the file to the parent component
      toast.success('File uploaded successfully!');
      onClose(); // Close the modal on successful upload
    } catch (error) {
      toast.error('File upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Modal Background */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="fixed inset-1/4 bg-white rounded-lg overflow-hidden shadow-lg z-10">
        <div className="p-4 ">
          <div className="mb-4 text-center">
            <label className="block text-m font-bold text-gray-700 ">Upload CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2 p-2 border rounded w-full"
            />
          </div>

          <div className="flex justify-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={isSubmitting || !selectedFile}
            >
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkUploadModal;
