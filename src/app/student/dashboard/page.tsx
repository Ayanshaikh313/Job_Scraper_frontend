'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BriefcaseBusiness, CalendarDays, FileText, Sparkles } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentLayout } from '@/components/StudentLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { applicationService, jobService } from '@/services/api';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalApplications: number;
  acceptedApplications: number;
  pendingApplications: number;
  totalInternalJobs: number;
  atsReportsGenerated: number;
  interviewsScheduled: number;
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
    atsReportsGenerated: 0,
    interviewsScheduled: 0,
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        const applicationsData: any[] = (applicationsRes as any).data || [];
        const jobsData: any[] = (jobsRes as any).data || [];

        setApplications(applicationsData);
        setJobs(jobsData);

        setStats({
          totalApplications: applicationsData.length,
          acceptedApplications: applicationsData.filter((app: any) => app.status === 'Accepted').length,
          pendingApplications: applicationsData.filter(
            (app: any) => app.status === 'Applied' || app.status === 'Reviewing'
          ).length,
          totalInternalJobs: jobsData.length,
          atsReportsGenerated: applicationsData.filter(
            (app: any) => app.atsEvaluation?.totalScore !== undefined && app.atsEvaluation?.totalScore !== null
          ).length,
          interviewsScheduled: applicationsData.filter((app: any) => {
            const status = String(app.status || '').toLowerCase();
            return status.includes('interview') || status.includes('schedule');
          }).length,
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

  const overviewCards = [
    {
      title: 'Applications Sent',
      value: stats.totalApplications,
      description: 'Active applications in motion',
      icon: BriefcaseBusiness,
      accent: 'text-primary',
    },
    {
      title: 'ATS Reports Generated',
      value: stats.atsReportsGenerated,
      description: 'Resume reports ready to review',
      icon: FileText,
      accent: 'text-emerald-600',
    },
    {
      title: 'Saved Jobs',
      value: Math.max(stats.totalInternalJobs, 0),
      description: 'Opportunities currently visible',
      icon: Bookmark,
      accent: 'text-amber-600',
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      description: 'Next steps lined up',
      icon: CalendarDays,
      accent: 'text-fuchsia-600',
    },
  ];

  return (
    <ProtectedRoute requiredRole="student">
      <StudentLayout>
        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <header className="rounded-[28px] border border-border/70 bg-background/90 p-6 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.40)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  Candidate dashboard
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Welcome back, {user?.name || 'there'}.
                </h1>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  Keep your applications, ATS feedback, and next steps organized in one calm workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/student/jobs" className={buttonVariants({ variant: 'default', className: 'gap-2' })}>
                  Explore roles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/student/applications" className={buttonVariants({ variant: 'outline' })}>
                  View applications
                </Link>
              </div>
            </div>
          </header>

          {error && (
            <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16">
              <LoadingSpinner size="lg" message="Loading your dashboard..." />
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overviewCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Card key={card.title} className="border-border/70 bg-card/90 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                            <p className="mt-3 text-3xl font-semibold text-foreground">{card.value}</p>
                          </div>
                          <div className={`rounded-2xl bg-muted p-2.5 ${card.accent}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
                <div className="space-y-6">
                  <Card className="border-border/70 bg-background/90 shadow-sm">
                    <CardHeader className="flex-row items-center justify-between px-6 py-5">
                      <div>
                        <CardTitle className="text-lg">Recent applications</CardTitle>
                        <CardDescription>Your latest activity and status updates</CardDescription>
                      </div>
                      <Link href="/student/applications" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                        View all
                      </Link>
                    </CardHeader>
                    <CardContent className="space-y-3 px-6 pb-6">
                      {applications.length > 0 ? (
                        applications.slice(0, 4).map((application: any) => (
                          <div key={application._id || application.id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/40 px-4 py-3">
                            <div>
                              <p className="font-medium text-foreground">{application.jobId?.title || application.title || 'Application'}</p>
                              <p className="text-sm text-muted-foreground">{application.jobId?.company || application.company || 'Role update available'}</p>
                            </div>
                            <Badge variant="secondary">{application.status || 'Applied'}</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-6 text-sm text-muted-foreground">
                          You haven’t submitted any applications yet. Start exploring jobs to build momentum.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-border/70 bg-background/90 shadow-sm">
                    <CardHeader className="px-6 py-5">
                      <CardTitle className="text-lg">ATS history</CardTitle>
                      <CardDescription>Resume insights generated from your recent submissions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 px-6 pb-6">
                      {applications.some((application: any) => application.atsEvaluation?.totalScore !== undefined) ? (
                        applications
                          .filter((application: any) => application.atsEvaluation?.totalScore !== undefined)
                          .slice(0, 4)
                          .map((application: any) => (
                            <div key={application._id || application.id} className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/40 px-4 py-3">
                              <div>
                                <p className="font-medium text-foreground">{application.jobId?.title || 'ATS review'}</p>
                                <p className="text-sm text-muted-foreground">{application.atsEvaluation?.recommendation || 'Ready for review'}</p>
                              </div>
                              <Badge variant="outline">{application.atsEvaluation?.totalScore ?? 0}/100</Badge>
                            </div>
                          ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-6 text-sm text-muted-foreground">
                          ATS feedback will appear here once applications include evaluation data.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-border/70 bg-background/90 shadow-sm">
                  <CardHeader className="px-6 py-5">
                    <CardTitle className="text-lg">Recommended jobs</CardTitle>
                    <CardDescription>Fresh opportunities aligned to your workflow</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-6 pb-6">
                    {jobs.length > 0 ? (
                      jobs.slice(0, 4).map((job: any) => (
                        <div key={job._id || job.id} className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">{job.title || 'Open role'}</p>
                              <p className="text-sm text-muted-foreground">{job.company || 'Company'} • {job.location || 'Remote'}</p>
                            </div>
                            <Badge variant="secondary">{job.jobType || 'Full-time'}</Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">{job.description ? job.description.slice(0, 80) : 'Explore this role'}...</p>
                            <Link href={`/student/jobs/${job._id || job.id}`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
                              Open
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-6 text-sm text-muted-foreground">
                        No job recommendations are available right now. Try refreshing your search.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </StudentLayout>
    </ProtectedRoute>
  );
}
