'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { applicationService, jobService } from '@/services/api';
import { Application, Job } from '@/types';

type ApplicationStatus = 'Applied' | 'Reviewing' | 'Rejected' | 'Accepted';

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [error, setError] = useState('');
  const jobId = params.jobId as string;

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  // Fetch job and applicants
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !jobId) return;

      try {
        setLoading(true);

        // Fetch job
        const jobRes: any = await jobService.getJobById(token, jobId);
        setJob(jobRes.data);

        // Fetch applicants for this job directly
        const appsRes: any = await applicationService.getJobApplicants(token, jobId, {
          limit: 1000,
        });

        setApplications(appsRes.data || []);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load applicants');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, jobId]);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    if (!token) return;

    try {
      setUpdatingStatus(applicationId);
      await applicationService.updateApplicationStatus(token, applicationId, newStatus);

      // Update local state
      setApplications(
        applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
      console.error(err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="hiring_manager">
        <HiringManagerLayout>
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading applicants...</p>
          </div>
        </HiringManagerLayout>
      </ProtectedRoute>
    );
  }

  if (error && !job) {
    return (
      <ProtectedRoute requiredRole="hiring_manager">
        <HiringManagerLayout>
          <div className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        </HiringManagerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 font-semibold mb-4"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {job?.title || 'Job'} - Applicants
            </h1>
            <p className="text-gray-600">Company: {job?.company}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Applicants List */}
          {applications.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Applicant Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr
                        key={app._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-900 font-semibold">
                          {app.studentId.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{app.studentId.email}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {app.status === 'Applied' && (
                              <button
                                onClick={() =>
                                  handleStatusChange(app._id, 'Reviewing')
                                }
                                disabled={updatingStatus === app._id}
                                className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                              >
                                {updatingStatus === app._id ? 'Updating...' : 'Review'}
                              </button>
                            )}
                            {app.status === 'Reviewing' && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusChange(app._id, 'Accepted')
                                  }
                                  disabled={updatingStatus === app._id}
                                  className="text-green-600 hover:text-green-700 font-semibold text-sm disabled:opacity-50"
                                >
                                  {updatingStatus === app._id ? 'Updating...' : 'Accept'}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(app._id, 'Rejected')
                                  }
                                  disabled={updatingStatus === app._id}
                                  className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-600">No applicants yet for this job.</p>
            </div>
          )}
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
