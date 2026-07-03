'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { useAuth } from '@/context/AuthContext';
import { applicationService, jobService } from '@/services/api';

interface DashboardStats {
  totalApplications: number;
  acceptedApplications: number;
  pendingApplications: number;
  totalInternalJobs: number;
}

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    totalInternalJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const [applicationsRes, jobsRes] = await Promise.all([
          applicationService.getMyApplications(token),
          jobService.getJobs(token),
        ]);

        const applications = applicationsRes.data || [];
        const jobs = jobsRes.data || [];

        setStats({
          totalApplications: applications.length,
          acceptedApplications: applications.filter(
            (app: any) => app.status === 'Accepted'
          ).length,
          pendingApplications: applications.filter(
            (app: any) => app.status === 'Applied' || app.status === 'Reviewing'
          ).length,
          totalInternalJobs: jobs.length,
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
    <ProtectedRoute requiredRole="student">
      <StudentLayout>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">Here's your job search overview</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Stats Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading stats...</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {/* Total Applications */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.totalApplications}
                  </div>
                  <p className="text-gray-600">Total Applications</p>
                </div>

                {/* Accepted */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.acceptedApplications}
                  </div>
                  <p className="text-gray-600">Accepted</p>
                </div>

                {/* Pending */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {stats.pendingApplications}
                  </div>
                  <p className="text-gray-600">Pending</p>
                </div>

                {/* Available Jobs */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.totalInternalJobs}
                  </div>
                  <p className="text-gray-600">Jobs Available</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Search Jobs Card */}
                <Link href="/student/jobs">
                  <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Search Jobs
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Browse internal and external job listings
                    </p>
                    <span className="text-blue-600 font-semibold">
                      Start Searching →
                    </span>
                  </div>
                </Link>

                {/* View Applications Card */}
                <Link href="/student/applications">
                  <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition cursor-pointer">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      My Applications
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Track your application status and history
                    </p>
                    <span className="text-blue-600 font-semibold">
                      View Applications →
                    </span>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}
