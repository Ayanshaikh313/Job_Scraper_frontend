'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Briefcase, CalendarDays, TrendingUp, Users } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ATSScoreBadge } from '@/components/ATSScoreBadge';
import { CandidateScoreCard } from '@/components/CandidateScoreCard';
import { applicationService, jobService } from '@/services/api';
import { Application, HiringManagerDashboardData, Job, User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const buildFallbackDashboard = async (authToken: string, currentUser: User) => {
    const jobsRes = await jobService.getJobs(authToken) as { data: Job[] };
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
      .slice(0, 6)
      .map((app) => ({ ...app }));

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
        const [dashboardRes, jobsRes] = await Promise.all([
          applicationService.getHiringManagerDashboard(token) as Promise<{ data: HiringManagerDashboardData }>,
          jobService.getJobs(token) as Promise<{ data: Job[] }>,
        ]);

        setStats(dashboardRes.data || initialStats);
        setJobs((jobsRes.data || []).filter((job) => job.createdBy?._id === user._id));
        setError('');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard stats';

        if (message === 'Route not found') {
          try {
            const fallbackStats = await buildFallbackDashboard(token, user);
            setStats(fallbackStats);
            setJobs([]);
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
  const openPositions = jobs.slice(0, 5);
  const hiringRate = stats.totalApplicants > 0 ? Math.round((stats.applicantsByStatus.accepted / stats.totalApplicants) * 100) : 0;

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">Recruiter Dashboard</p>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Hiring manager insights</h1>
              <p className="mt-2 max-w-2xl text-gray-600">Monitor open roles, candidate flow, and hiring momentum from a unified HR dashboard.</p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Average ATS Score</div>
              <div className="mt-3">
                <ATSScoreBadge score={stats.averageAtsScore} recommendation="Live performance" />
              </div>
            </div>
          </div>

          {error ? (
            <div className="mb-8 rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 shadow-sm">{error}</div>
          ) : null}

          {loading ? (
            <div className="py-16">
              <LoadingSpinner size="lg" message="Loading dashboard data..." />
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Active Jobs</p>
                      <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.totalJobs}</p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                      <Briefcase className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Open roles currently accepting applications.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Total Applicants</p>
                      <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.totalApplicants}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Candidates in your recruiting pipeline.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Interviews</p>
                      <p className="mt-4 text-4xl font-semibold text-slate-900">{stats.applicantsByStatus.reviewing}</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Candidates currently in review or interview stage.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Hiring Rate</p>
                      <p className="mt-4 text-4xl font-semibold text-slate-900">{hiringRate}%</p>
                    </div>
                    <div className="rounded-2xl bg-fuchsia-50 p-3 text-fuchsia-700">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Accepted vs total applicants.</p>
                </div>
              </div>

              <div className="mb-8 grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
                <Card className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <CardHeader className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Application Trends</CardTitle>
                      <CardDescription>Track candidate momentum across your roles.</CardDescription>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-700">Last 30 days</span>
                  </CardHeader>
                  <div className="space-y-4">
                    {[
                      { label: 'Applied', value: stats.applicantsByStatus.applied, color: 'bg-blue-500' },
                      { label: 'Reviewing', value: stats.applicantsByStatus.reviewing, color: 'bg-emerald-500' },
                      { label: 'Accepted', value: stats.applicantsByStatus.accepted, color: 'bg-fuchsia-500' },
                      { label: 'Rejected', value: stats.applicantsByStatus.rejected, color: 'bg-slate-400' },
                    ].map((segment) => {
                      const width = stats.totalApplicants > 0 ? Math.max(10, Math.round((segment.value / stats.totalApplicants) * 100)) : 10;
                      return (
                        <div key={segment.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                            <span>{segment.label}</span>
                            <span>{segment.value}</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div className={`${segment.color} h-3 rounded-full`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <CardHeader className="mb-6">
                    <CardTitle className="text-xl">Hiring Funnel</CardTitle>
                    <CardDescription>Where candidates stand in the recruitment lifecycle.</CardDescription>
                  </CardHeader>
                  <div className="space-y-4">
                    {[
                      { label: 'Applicants', value: stats.totalApplicants, color: 'from-blue-600 to-blue-400' },
                      { label: 'Screening', value: stats.applicantsByStatus.reviewing, color: 'from-emerald-600 to-emerald-400' },
                      { label: 'Offers', value: stats.applicantsByStatus.accepted, color: 'from-fuchsia-600 to-fuchsia-400' },
                      { label: 'Declines', value: stats.applicantsByStatus.rejected, color: 'from-slate-500 to-slate-400' },
                    ].map((stage) => {
                      const width = stats.totalApplicants > 0 ? Math.max(10, Math.round((stage.value / stats.totalApplicants) * 100)) : 10;
                      return (
                        <div key={stage.label} className="space-y-2">
                          <div className="flex items-center justify-between text-sm text-slate-700">
                            <span>{stage.label}</span>
                            <span>{stage.value}</span>
                          </div>
                          <div className="overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-3 bg-linear-to-r ${stage.color}`} style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <Card className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <CardHeader className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Recent Applicants</CardTitle>
                      <CardDescription>Latest candidates in your active funnel.</CardDescription>
                    </div>
                    <Link href="/hiring-manager/applicants" className="text-sm font-semibold text-blue-600 hover:underline">
                      View all
                    </Link>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>ATS Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCandidates.length > 0 ? (
                          topCandidates.slice(0, 6).map((candidate) => (
                            <TableRow key={candidate._id}>
                              <TableCell className="font-medium text-foreground">{candidate.studentId?.name || 'Unknown'}</TableCell>
                              <TableCell>{candidate.jobId?.title || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant={candidate.status === 'Accepted' ? 'secondary' : candidate.status === 'Reviewing' ? 'outline' : 'ghost'}>
                                  {candidate.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{candidate.atsEvaluation?.totalScore ?? '—'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                              No recent applicants available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                <Card className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <CardHeader className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">Open Positions</CardTitle>
                      <CardDescription>Jobs currently accepting applications.</CardDescription>
                    </div>
                    <Link href="/hiring-manager/jobs" className="text-sm font-semibold text-blue-600 hover:underline">
                      Manage jobs
                    </Link>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Applicants</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {openPositions.length > 0 ? (
                          openPositions.map((job) => (
                            <TableRow key={job._id}>
                              <TableCell className="font-medium text-foreground">{job.title}</TableCell>
                              <TableCell>{job.location || 'Remote'}</TableCell>
                              <TableCell>{job.employmentType || 'Full-time'}</TableCell>
                              <TableCell>{Math.max(1, Math.round(stats.totalApplicants / Math.max(stats.totalJobs, 1)))}+</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="p-10 text-center text-sm text-muted-foreground">
                              No open positions found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
