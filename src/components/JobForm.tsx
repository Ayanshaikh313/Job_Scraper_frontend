'use client';

import { useState } from 'react';
import { Job } from '@/types';
import { showToast } from '@/utils/toast';

interface JobFormProps {
  initialData?: Job;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  buttonText?: string;
  isEditing?: boolean;
}

export const JobForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  buttonText = 'Create Job',
  isEditing = false,
}: JobFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [salary, setSalary] = useState(initialData?.salary || '');
  const [employmentType, setEmploymentType] = useState(
    initialData?.employmentType || 'Full-time'
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !company || !location || !description || !salary || !employmentType) {
      const errorMsg = 'Please fill in all fields';
      setError(errorMsg);
      showToast.validationError(errorMsg);
      return;
    }

    try {
      await onSubmit({
        title,
        company,
        location,
        description,
        salary,
        employmentType,
      });
      
      // Show appropriate toast based on whether it's create or edit
      if (isEditing) {
        showToast.jobUpdated();
      } else {
        showToast.jobCreated();
      }
      
      setSuccess('Job saved successfully!');
      if (!initialData) {
        // Reset form on create
        setTitle('');
        setCompany('');
        setLocation('');
        setDescription('');
        setSalary('');
        setEmploymentType('Full-time');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to save job';
      setError(errorMsg);
      showToast.apiError(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Job Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Job Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Senior React Developer"
        />
      </div>

      {/* Company */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your company name"
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Remote, New York, NY"
        />
      </div>

      {/* Salary */}
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
          Salary Range
        </label>
        <input
          id="salary"
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., $80,000 - $120,000"
        />
      </div>

      {/* Employment Type */}
      <div>
        <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
          Employment Type
        </label>
        <select
          id="employmentType"
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Job Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter job description..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold"
      >
        {isLoading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
};
