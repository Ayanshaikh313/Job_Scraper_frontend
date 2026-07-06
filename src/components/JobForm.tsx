'use client';

import { useState } from 'react';
import { Job, ScreeningQuestion } from '@/types';
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
  const [screeningQuestions, setScreeningQuestions] = useState<ScreeningQuestion[]>(
    initialData?.screeningQuestions || []
  );
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionRequired, setNewQuestionRequired] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      showToast.error('Question cannot be empty');
      return;
    }

    setScreeningQuestions([
      ...screeningQuestions,
      {
        question: newQuestion.trim(),
        required: newQuestionRequired,
      },
    ]);

    setNewQuestion('');
    setNewQuestionRequired(false);
    showToast.success('Question added');
  };

  const handleRemoveQuestion = (index: number) => {
    setScreeningQuestions(screeningQuestions.filter((_, i) => i !== index));
    showToast.info('Question removed');
  };

  const handleToggleRequired = (index: number) => {
    setScreeningQuestions(
      screeningQuestions.map((q, i) =>
        i === index ? { ...q, required: !q.required } : q
      )
    );
  };

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
        screeningQuestions,
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
        setScreeningQuestions([]);
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

      {/* Screening Questions Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Questions (Optional)</h3>

        {/* Add New Question */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 space-y-4">
          <div>
            <label htmlFor="newQuestion" className="block text-sm font-medium text-gray-700 mb-2">
              Add a Screening Question
            </label>
            <textarea
              id="newQuestion"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              rows={2}
              placeholder="e.g., Why should we hire you?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newQuestionRequired}
                onChange={(e) => setNewQuestionRequired(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Mark as required</span>
            </label>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        {screeningQuestions.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Questions ({screeningQuestions.length})</h4>
            {screeningQuestions.map((q, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 flex justify-between items-start ${
                  q.required ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{q.question}</p>
                  {q.required && (
                    <p className="text-xs text-red-600 font-semibold mt-1">* Required</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleToggleRequired(idx)}
                    className={`px-3 py-1 rounded text-sm font-semibold transition ${
                      q.required
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    {q.required ? 'Required' : 'Optional'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded font-semibold hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
