'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { applicationService, jobService } from '@/services/api';

interface DashboardStats {
  totalApplications: number;
  acceptedApplications: number;
  pendingApplications: number;
  totalInternalJobs: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    totalInternalJobs: 0,
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
        const [applicationsRes, jobsRes] = await Promise.all([
          applicationService.getMyApplications(token),
          jobService.getJobs(token),
        ]);

        const applications: any = (applicationsRes as any).data || [];
        const jobs: any = (jobsRes as any).data || [];

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
            <div className="py-12">
              <LoadingSpinner size="lg" message="Loading your dashboard..." />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {/* Total Applications */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {stats.totalApplications}
                  </div>
                  <p className="text-gray-700 font-medium">Total Applications</p>
                </div>

                {/* Accepted */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-600">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {stats.acceptedApplications}
                  </div>
                  <p className="text-gray-700 font-medium">Accepted</p>
                </div>

                {/* Pending */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {stats.pendingApplications}
                  </div>
                  <p className="text-gray-700 font-medium">Pending</p>
                </div>

                {/* Available Jobs */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {stats.totalInternalJobs}
                  </div>
                  <p className="text-gray-700 font-medium">Jobs Available</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Search Jobs Card */}
                <Link href="/student/jobs">
                  <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg hover:scale-105 transition cursor-pointer">
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
                  <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg hover:scale-105 transition cursor-pointer">
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
