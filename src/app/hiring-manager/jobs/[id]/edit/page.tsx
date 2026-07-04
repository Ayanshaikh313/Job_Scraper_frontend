'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { JobForm } from '@/components/JobForm';
import { jobService } from '@/services/api';
import { Job } from '@/types';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const jobId = params.id as string;

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      if (!token || !jobId) return;

      try {
        setLoading(true);
        const res: any = await jobService.getJobById(token, jobId);
        setJob(res.data);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load job');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [token, jobId]);

  const handleSubmit = async (data: any) => {
    if (!token || !jobId) return;

    try {
      setSubmitting(true);
      await jobService.updateJob(token, jobId, data);
      router.push('/hiring-manager/jobs');
    } catch (err) {
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="hiring_manager">
        <HiringManagerLayout>
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading job...</p>
          </div>
        </HiringManagerLayout>
      </ProtectedRoute>
    );
  }

  if (error || !job) {
    return (
      <ProtectedRoute requiredRole="hiring_manager">
        <HiringManagerLayout>
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error || 'Job not found'}
            </div>
          </div>
        </HiringManagerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-600">Update job details</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <JobForm
              initialData={job}
              onSubmit={handleSubmit}
              isLoading={submitting}
              buttonText="Update Job"
              isEditing={true}
            />
          </div>
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
