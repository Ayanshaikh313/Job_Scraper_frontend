'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { JobCard } from '@/components/JobCard';
import { useAuth } from '@/context/AuthContext';
import { jobService } from '@/services/api';
import { Job, ExternalJob } from '@/types';

export default function StudentJobsPage() {
  const { token } = useAuth();
  const [internalJobs, setInternalJobs] = useState<Job[]>([]);
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [search, setSearch] = useState('');
  const [loadingInternal, setLoadingInternal] = useState(true);
  const [loadingExternal, setLoadingExternal] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;

      try {
        // Fetch internal jobs
        setLoadingInternal(true);
        const internalRes = await jobService.getJobs(token, {
          search: search || undefined,
        });
        setInternalJobs(internalRes.data || []);

        // Fetch external jobs
        setLoadingExternal(true);
        const externalRes = await jobService.getExternalJobs(token, {
          search: search || undefined,
        });
        setExternalJobs(externalRes.data || []);

        setError('');
      } catch (err) {
        setError('Failed to load jobs. Please try again.');
        console.error(err);
      } finally {
        setLoadingInternal(false);
        setLoadingExternal(false);
      }
    };

    const timer = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, token]);

  return (
    <ProtectedRoute requiredRole="student">
      <StudentLayout>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Jobs
            </h1>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <input
                type="text"
                placeholder="Search by job title, company, or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Internal Jobs Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Internal Jobs ({internalJobs.length})
            </h2>
            {loadingInternal ? (
              <div className="text-center py-8 text-gray-600">Loading jobs...</div>
            ) : internalJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internalJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
                No internal jobs found. Try a different search.
              </div>
            )}
          </div>

          {/* External Jobs Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              External Jobs ({externalJobs.length})
            </h2>
            {loadingExternal ? (
              <div className="text-center py-8 text-gray-600">Loading jobs...</div>
            ) : externalJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {externalJobs.map((job, idx) => (
                  <JobCard
                    key={`${job.source}-${idx}`}
                    job={job}
                    isExternal={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-600">
                No external jobs found. Try a different search.
              </div>
            )}
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}
