'use client';

import { useState } from 'react';
import { Job, ApplicationAnswer, ScreeningQuestion } from '@/types';
import { showToast } from '@/utils/toast';

interface ApplicationFormProps {
  job: Job;
  token: string;
  onSubmit: (resume: File, answers: ApplicationAnswer[]) => Promise<void>;
  isLoading?: boolean;
}

export const ApplicationForm = ({
  job,
  token,
  onSubmit,
  isLoading = false,
}: ApplicationFormProps) => {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate PDF
      if (file.type !== 'application/pdf') {
        showToast.error('Only PDF files are allowed');
        return;
      }

      // Validate file size (5 MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast.error('File size must be less than 5 MB');
        return;
      }

      setResume(file);
      setResumeFileName(file.name);
      setErrors(prev => ({ ...prev, resume: '' }));
      showToast.success('Resume uploaded successfully');
    }
  };

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value,
    }));
    setErrors(prev => ({ ...prev, [question]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!resume) {
      newErrors.resume = 'Resume is required';
    }

    // Check required questions
    if (job.screeningQuestions) {
      const requiredQuestions = job.screeningQuestions.filter(q => q.required);
      for (const q of requiredQuestions) {
        if (!answers[q.question] || !answers[q.question].trim()) {
          newErrors[q.question] = 'This question is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error('Please fill all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Convert answers to array format
      const answersArray: ApplicationAnswer[] = Object.entries(answers)
        .filter(([, answer]) => answer.trim())
        .map(([question, answer]) => ({
          question,
          answer,
        }));

      await onSubmit(resume!, answersArray);
      showToast.success('Application submitted successfully!');
    } catch (err: any) {
      showToast.error(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const requiredQuestions = job.screeningQuestions?.filter(q => q.required) || [];
  const optionalQuestions = job.screeningQuestions?.filter(q => !q.required) || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Resume Upload Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-100 transition cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="hidden"
              id="resume-input"
            />
            <label htmlFor="resume-input" className="cursor-pointer">
              <svg
                className="w-12 h-12 mx-auto text-blue-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-gray-600">
                {resumeFileName ? (
                  <span className="text-green-600 font-semibold">✓ {resumeFileName}</span>
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1">PDF up to 5 MB</p>
            </label>
          </div>
          {errors.resume && (
            <p className="text-red-600 text-sm font-medium">{errors.resume}</p>
          )}
        </div>
      </div>

      {/* Screening Questions Section */}
      {job.screeningQuestions && job.screeningQuestions.length > 0 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Questions</h3>
            {requiredQuestions.length > 0 && (
              <p className="text-sm text-red-600 mb-4">* Required fields</p>
            )}
          </div>

          {/* Required Questions */}
          {requiredQuestions.length > 0 && (
            <div className="space-y-4 bg-red-50 border border-red-200 rounded-lg p-6">
              {requiredQuestions.map(q => (
                <div key={q.question} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {q.question} <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={answers[q.question] || ''}
                    onChange={e => handleAnswerChange(q.question, e.target.value)}
                    rows={4}
                    placeholder="Your answer..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors[q.question] && (
                    <p className="text-red-600 text-sm font-medium">{errors[q.question]}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Optional Questions */}
          {optionalQuestions.length > 0 && (
            <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-6">
              {optionalQuestions.map(q => (
                <div key={q.question} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {q.question}
                  </label>
                  <textarea
                    value={answers[q.question] || ''}
                    onChange={e => handleAnswerChange(q.question, e.target.value)}
                    rows={3}
                    placeholder="Your answer..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting || isLoading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-semibold flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
};
