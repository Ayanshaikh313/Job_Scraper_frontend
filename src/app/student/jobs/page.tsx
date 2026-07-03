'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { JobCard } from '@/components/JobCard';
import { jobService } from '@/services/api';
import { Job, ExternalJob } from '@/types';

export default function StudentJobsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [internalJobs, setInternalJobs] = useState<Job[]>([]);
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [search, setSearch] = useState('');
  const [loadingInternal, setLoadingInternal] = useState(true);
  const [loadingExternal, setLoadingExternal] = useState(true);
  const [error, setError] = useState('');

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      console.log('[StudentJobsPage] Token from localStorage:', storedToken ? storedToken.substring(0, 20) + '...' : 'null');
      setToken(storedToken);
    }
  }, []);

  // Log when external jobs state changes
  useEffect(() => {
    console.log('[StudentJobsPage] externalJobs state updated:', externalJobs.length, 'jobs');
  }, [externalJobs]);

  // Log when internal jobs state changes
  useEffect(() => {
    console.log('[StudentJobsPage] internalJobs state updated:', internalJobs.length, 'jobs');
  }, [internalJobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) {
        console.log('[StudentJobsPage] No token available');
        return;
      }

      try {
        console.log('[StudentJobsPage] Starting fetch with token:', token.substring(0, 20) + '...');
        
        // Fetch internal jobs
        setLoadingInternal(true);
        console.log('[StudentJobsPage] Fetching internal jobs...');
        const internalRes = await jobService.getJobs(token, {
          search: search || undefined,
        });
        console.log('[StudentJobsPage] Internal jobs response:', internalRes);
        setInternalJobs(internalRes.data || []);

        // Fetch external jobs
        setLoadingExternal(true);
        console.log('[StudentJobsPage] Fetching external jobs...');
        const externalRes = await jobService.getExternalJobs(token, {
          search: search || undefined,
        });
        console.log('[StudentJobsPage] External jobs response:', externalRes);
        console.log('[StudentJobsPage] External jobs data:', externalRes.data);
        console.log('[StudentJobsPage] External jobs data length:', externalRes.data?.length);
        setExternalJobs(externalRes.data || []);

        setError('');
        console.log('[StudentJobsPage] Fetch completed successfully');
      } catch (err) {
        console.error('[StudentJobsPage] Error fetching jobs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load jobs. Please try again.');
      } finally {
        setLoadingInternal(false);
        setLoadingExternal(false);
      }
    };

    const timer = setTimeout(() => {
      console.log('[StudentJobsPage] Timer triggered, calling fetchJobs');
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
