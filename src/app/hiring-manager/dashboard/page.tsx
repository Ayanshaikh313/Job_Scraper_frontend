'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { jobService, applicationService } from '@/services/api';

interface DashboardStats {
  totalJobs: number;
  totalApplicants: number;
  applicantsByStatus: {
    applied: number;
    reviewing: number;
    accepted: number;
    rejected: number;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function HiringManagerDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalApplicants: 0,
    applicantsByStatus: {
      applied: 0,
      reviewing: 0,
      accepted: 0,
      rejected: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get token and user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        setLoading(true);
        
        // Get all jobs created by this hiring manager
        const jobsRes: any = await jobService.getJobs(token);
        const jobs = jobsRes.data || [];

        // For each job, get its applicants
        let totalApplicants = 0;
        const statuses = {
          applied: 0,
          reviewing: 0,
          accepted: 0,
          rejected: 0,
        };

        for (const job of jobs) {
          try {
            const applicantsRes: any = await applicationService.getJobApplicants(
              token,
              job._id
            );
            const applicants = applicantsRes.data || [];
            totalApplicants += applicants.length;

            // Count by status
            applicants.forEach((app: any) => {
              if (app.status === 'Applied') statuses.applied++;
              else if (app.status === 'Reviewing') statuses.reviewing++;
              else if (app.status === 'Accepted') statuses.accepted++;
              else if (app.status === 'Rejected') statuses.rejected++;
            });
          } catch (err) {
            console.error(`Failed to fetch applicants for job ${job._id}:`, err);
          }
        }

        setStats({
          totalJobs: jobs.length,
          totalApplicants,
          applicantsByStatus: statuses,
        });
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">Manage your jobs and applicants</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Stats Grid */}
          {loading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" message="Loading your dashboard..." />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {/* Total Jobs */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.totalJobs}
                  </div>
                  <p className="text-gray-700 font-medium">Total Jobs Posted</p>
                </div>

                {/* Total Applicants */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.totalApplicants}
                  </div>
                  <p className="text-gray-700 font-medium">Total Applicants</p>
                </div>

                {/* Reviewing */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {stats.applicantsByStatus.reviewing}
                  </div>
                  <p className="text-gray-700 font-medium">Under Review</p>
                </div>

                {/* Accepted */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.applicantsByStatus.accepted}
                  </div>
                  <p className="text-gray-700 font-medium">Accepted</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Post Job Card */}
                <Link href="/hiring-manager/jobs/create">
                  <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg hover:scale-105 transition cursor-pointer">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Post a New Job
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create a new job posting to attract candidates
                    </p>
                    <span className="text-blue-600 font-semibold">
                      Post Job →
                    </span>
                  </div>
                </Link>

                {/* View Jobs Card */}
                <Link href="/hiring-manager/jobs">
                  <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg hover:scale-105 transition cursor-pointer">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      My Jobs
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Manage and track your job postings
                    </p>
                    <span className="text-blue-600 font-semibold">
                      View Jobs →
                    </span>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
