'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { JobCard } from '@/components/JobCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonCard } from '@/components/SkeletonCard';
import { jobService } from '@/services/api';
import { Job, ExternalJob } from '@/types';

export default function StudentJobsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [internalJobs, setInternalJobs] = useState<Job[]>([]);
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('');
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

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;

      try {
        console.log('[StudentJobsPage] Starting fetch with token:', token.substring(0, 20) + '...');
        
        // Fetch internal jobs
        setLoadingInternal(true);
        console.log('[StudentJobsPage] Fetching internal jobs...');
        const internalRes = await jobService.getJobs(token, {
          search: search || undefined,
          location: location || undefined,
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
  }, [search, location, employmentType, token]);

  const handleClearFilters = () => {
    setSearch('');
    setLocation('');
    setEmploymentType('');
  };

  // Filter internal jobs by employment type
  const filteredInternalJobs = employmentType
    ? internalJobs.filter((job) => job.employmentType === employmentType)
    : internalJobs;

  return (
    <ProtectedRoute requiredRole="student">
      <StudentLayout>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Search Jobs
            </h1>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              {/* Search Bar */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Title or Company
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="e.g., React Developer, Google"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="e.g., Remote, New York"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Employment Type Filter */}
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
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(search || location || employmentType) && (
                <button
                  onClick={handleClearFilters}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Clear Filters
                </button>
              )}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              Internal Jobs <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Internal</span>
              <span className="text-lg text-gray-600">({filteredInternalJobs.length})</span>
            </h2>
            {loadingInternal ? (
              <SkeletonCard count={3} columns={3} />
            ) : filteredInternalJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInternalJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="💼"
                title="No internal jobs found"
                description="Try adjusting your search filters or check back later for new opportunities."
              />
            )}
          </div>

          {/* External Jobs Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              External Jobs <span className="text-lg text-gray-600">({externalJobs.length})</span>
            </h2>
            {loadingExternal ? (
              <SkeletonCard count={3} columns={3} />
            ) : externalJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {externalJobs.map((job, idx) => (
                  <div key={`${job.source}-${idx}`} className="relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.source === 'RemoteOK'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {job.source}
                      </span>
                    </div>
                    <JobCard job={job} isExternal={true} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="🌍"
                title="No external jobs found"
                description="Try adjusting your search filters or check back later for new opportunities."
              />
            )}
          </div>
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}
