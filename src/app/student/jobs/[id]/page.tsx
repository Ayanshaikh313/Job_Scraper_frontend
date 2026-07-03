'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { jobService, applicationService } from '@/services/api';
import { Job } from '@/types';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      if (!token || !jobId) return;

      try {
        const res = await jobService.getJobById(token, jobId);
        setJob(res.data);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, token]);

  const handleApply = async () => {
    if (!token || !jobId) return;

    setApplying(true);
    try {
      await applicationService.applyToJob(token, jobId);
      setApplied(true);
      setSuccessMessage('Application submitted successfully!');
      setTimeout(() => {
        router.push('/student/applications');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="student">
        <StudentLayout>
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  if (error || !job) {
    return (
      <ProtectedRoute requiredRole="student">
        <StudentLayout>
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error || 'Job not found'}
            </div>
          </div>
        </StudentLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="student">
      <StudentLayout>
        <div className="p-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-semibold mb-6"
          >
            ← Back
          </button>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-2xl text-gray-600">{job.company}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {job.employmentType}
                </span>
              </div>

              {/* Key Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="text-lg font-semibold text-gray-900">{job.location}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Salary</p>
                  <p className="text-lg font-semibold text-gray-900">{job.salary}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm">Posted By</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {job.createdBy.name}
                  </p>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApply}
                disabled={applied || applying}
                className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                  applied
                    ? 'bg-green-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {applied ? '✓ Applied' : applying ? 'Applying...' : 'Apply Now'}
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>

            {/* Creator Info */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Posted By
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{job.createdBy.name}</p>
                <p className="text-gray-600">{job.createdBy.email}</p>
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}
