'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { jobService } from '@/services/api';
import { Job } from '@/types';

export default function HiringManagerJobsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const res = await jobService.getJobs(token);
        setJobs(res.data || []);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const handleDelete = async (jobId: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this job?')) return;

    try {
      setDeleting(jobId);
      await jobService.deleteJob(token, jobId);
      setJobs(jobs.filter((job) => job._id !== jobId));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete job');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
              <p className="text-gray-600">Manage your job postings</p>
            </div>
            <Link href="/hiring-manager/jobs/create">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                + Post Job
              </button>
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Jobs List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Posted Date
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr
                        key={job._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-gray-900 font-semibold">
                          {job.title}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{job.company}</td>
                        <td className="px-6 py-4 text-gray-700">{job.location}</td>
                        <td className="px-6 py-4 text-gray-700">
                          {job.employmentType}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/hiring-manager/applicants/${job._id}`}
                              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                            >
                              Applicants
                            </Link>
                            <Link
                              href={`/hiring-manager/jobs/${job._id}/edit`}
                              className="text-green-600 hover:text-green-700 font-semibold text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(job._id)}
                              disabled={deleting === job._id}
                              className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50"
                            >
                              {deleting === job._id ? 'Deleting...' : 'Delete'}
                            </button>
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
              <p className="text-gray-600 mb-4">No jobs posted yet.</p>
              <Link href="/hiring-manager/jobs/create">
                <span className="text-blue-600 hover:text-blue-700 font-semibold">
                  Post your first job →
                </span>
              </Link>
            </div>
          )}
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
