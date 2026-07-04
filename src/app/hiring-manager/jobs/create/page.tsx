'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { JobForm } from '@/components/JobForm';
import { jobService } from '@/services/api';

export default function CreateJobPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (data: any) => {
    if (!token) return;

    try {
      setLoading(true);
      await jobService.createJob(token, data);
      router.push('/hiring-manager/jobs');
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
            <p className="text-gray-600">Fill in the details below to create a job posting</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <JobForm
              onSubmit={handleSubmit}
              isLoading={loading}
              buttonText="Post Job"
            />
          </div>
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
