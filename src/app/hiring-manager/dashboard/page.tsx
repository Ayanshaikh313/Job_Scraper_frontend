'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ATSScoreBadge } from '@/components/ATSScoreBadge';
import { CandidateScoreCard } from '@/components/CandidateScoreCard';
import { applicationService, jobService } from '@/services/api';
import { Application, HiringManagerDashboardData, User } from '@/types';

const initialStats: HiringManagerDashboardData = {
  totalJobs: 0,
  totalApplicants: 0,
  averageAtsScore: 0,
  strongMatches: 0,
  mediumMatches: 0,
  weakMatches: 0,
  applicantsByStatus: {
    applied: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
  },
  topCandidates: [],
};

export default function HiringManagerDashboard() {
  const [token] = useState<string | null>(() => (typeof window === 'undefined' ? null : localStorage.getItem('token')));
  const [user] = useState<User | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedUser = localStorage.getItem('user');
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });
  const [stats, setStats] = useState<HiringManagerDashboardData>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const buildFallbackDashboard = async (authToken: string, currentUser: User) => {
    const jobsRes = await jobService.getJobs(authToken) as { data: Application['jobId'][] };
    const ownJobs = (jobsRes.data || []).filter((job: any) => job.createdBy?._id === currentUser._id);

    const applicantGroups = await Promise.all(
      ownJobs.map(async (job: any) => {
        const applicantsRes = await applicationService.getJobApplicants(authToken, job._id, { limit: 1000 }) as {
          data: Application[];
        };
        return applicantsRes.data || [];
      })
    );

    const applications = applicantGroups.flat();
    const totalScore = applications.reduce((sum, app) => sum + (app.atsEvaluation?.totalScore || 0), 0);
    const topCandidates = [...applications]
      .sort((a, b) => (b.atsEvaluation?.totalScore || 0) - (a.atsEvaluation?.totalScore || 0))
      .slice(0, 5)
      .map((app, index) => ({ ...app, rank: index + 1 }));

    return {
      totalJobs: ownJobs.length,
      totalApplicants: applications.length,
      averageAtsScore: applications.length > 0 ? Math.round(totalScore / applications.length) : 0,
      strongMatches: applications.filter((app) => (app.atsEvaluation?.totalScore || 0) >= 80).length,
      mediumMatches: applications.filter((app) => {
        const score = app.atsEvaluation?.totalScore || 0;
        return score >= 60 && score < 80;
      }).length,
      weakMatches: applications.filter((app) => (app.atsEvaluation?.totalScore || 0) < 60).length,
      applicantsByStatus: {
        applied: applications.filter((app) => app.status === 'Applied').length,
        reviewing: applications.filter((app) => app.status === 'Reviewing').length,
        accepted: applications.filter((app) => app.status === 'Accepted').length,
        rejected: applications.filter((app) => app.status === 'Rejected').length,
      },
      topCandidates,
    } satisfies HiringManagerDashboardData;
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!token || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await applicationService.getHiringManagerDashboard(token) as {
          data: HiringManagerDashboardData;
        };
        setStats(response.data || initialStats);
        setError('');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard stats';

        if (message === 'Route not found') {
          try {
            const fallbackStats = await buildFallbackDashboard(token, user);
            setStats(fallbackStats);
            setError('');
          } catch (fallbackError) {
            const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : message;
            setError(fallbackMessage);
          }
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, user]);

  const topCandidates = stats.topCandidates || [];

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
                ATS Intelligence
              </p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Welcome back, {user?.name || 'Hiring Manager'}
              </h1>
              <p className="mt-2 max-w-2xl text-gray-600">
                Review applicant quality, compare ATS performance, and move the strongest candidates forward faster.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Portfolio Average
              </div>
              <div className="mt-2">
                <ATSScoreBadge score={stats.averageAtsScore} recommendation="Average ATS Score" />
              </div>
            </div>
          </div>

          {error ? (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="py-16">
              <LoadingSpinner size="lg" message="Loading ATS dashboard..." />
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Jobs</div>
                  <div className="mt-3 text-4xl font-bold text-gray-900">{stats.totalJobs}</div>
                  <p className="mt-2 text-sm text-gray-600">Active posts you can rank with ATS scoring.</p>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Applicants</div>
                  <div className="mt-3 text-4xl font-bold text-gray-900">{stats.totalApplicants}</div>
                  <p className="mt-2 text-sm text-gray-600">All candidates across your current jobs.</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Strong</div>
                  <div className="mt-3 text-4xl font-bold text-emerald-800">{stats.strongMatches}</div>
                  <p className="mt-2 text-sm text-emerald-700">Candidates scoring 80 and above.</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-6 shadow-sm ring-1 ring-amber-100">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Medium</div>
                  <div className="mt-3 text-4xl font-bold text-amber-800">{stats.mediumMatches}</div>
                  <p className="mt-2 text-sm text-amber-700">Candidates scoring between 60 and 79.</p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-6 shadow-sm ring-1 ring-rose-100">
                  <div className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">Weak</div>
                  <div className="mt-3 text-4xl font-bold text-rose-800">{stats.weakMatches}</div>
                  <p className="mt-2 text-sm text-rose-700">Candidates needing the most manual review.</p>
                </div>
              </div>

              <div className="mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Top ATS Candidates</h2>
                      <p className="mt-1 text-sm text-gray-600">Your five strongest matches at a glance.</p>
                    </div>
                    <Link
                      href="/hiring-manager/jobs"
                      className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                    >
                      View Jobs
                    </Link>
                  </div>

                  {topCandidates.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                      {topCandidates.map((candidate: Application) => (
                        <CandidateScoreCard
                          key={candidate._id}
                          application={candidate}
                          jobId={candidate.jobId?._id || ''}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center text-gray-600">
                      ATS score cards will appear here once candidates start applying.
                    </div>
                  )}
                </div>

                <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
                  <h2 className="text-2xl font-bold">Applicant Flow</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    A quick status view alongside the ATS average for your hiring pipeline.
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Applied</div>
                      <div className="mt-2 text-3xl font-bold">{stats.applicantsByStatus.applied}</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Reviewing</div>
                      <div className="mt-2 text-3xl font-bold">{stats.applicantsByStatus.reviewing}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white/10 p-4">
                        <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Accepted</div>
                        <div className="mt-2 text-3xl font-bold">{stats.applicantsByStatus.accepted}</div>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4">
                        <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Rejected</div>
                        <div className="mt-2 text-3xl font-bold">{stats.applicantsByStatus.rejected}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Link href="/hiring-manager/jobs/create" className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Quick Action</div>
                  <h3 className="mt-3 text-2xl font-bold text-gray-900">Post a New Job</h3>
                  <p className="mt-2 text-gray-600">
                    Add a fresh role so the ATS engine can start ranking new candidates automatically.
                  </p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-blue-700">Create posting</span>
                </Link>

                <Link href="/hiring-manager/jobs" className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-500">Quick Action</div>
                  <h3 className="mt-3 text-2xl font-bold text-gray-900">Open Ranking Tables</h3>
                  <p className="mt-2 text-gray-600">
                    Jump into any job, compare ATS scores, and drill into candidate-level keyword and skill gaps.
                  </p>
                  <span className="mt-6 inline-flex text-sm font-semibold text-gray-900">Review applicants</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
