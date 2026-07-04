'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { ResumeViewer } from '@/components/ResumeViewer';
import { AnswersViewer } from '@/components/AnswersViewer';
import { ATSScoreBadge } from '@/components/ATSScoreBadge';
import { ATSProgressBar } from '@/components/ATSProgressBar';
import { CandidateScoreCard } from '@/components/CandidateScoreCard';
import { applicationService, jobService } from '@/services/api';
import { showToast } from '@/utils/toast';
import { Application, AtsSummary, Job } from '@/types';

type ApplicationStatus = 'Applied' | 'Reviewing' | 'Rejected' | 'Accepted';

const emptySummary: AtsSummary = {
  totalApplicants: 0,
  averageAtsScore: 0,
  strongMatches: 0,
  mediumMatches: 0,
  weakMatches: 0,
};

const buildFallbackRanking = (applications: Application[]) => {
  const ranked = [...applications]
    .sort((a, b) => {
      const scoreDelta = (b.atsEvaluation?.totalScore || 0) - (a.atsEvaluation?.totalScore || 0);
      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
    })
    .map((application, index) => ({
      ...application,
      rank: index + 1,
    }));

  const summary: AtsSummary = {
    totalApplicants: ranked.length,
    averageAtsScore: ranked.length > 0
      ? Math.round(ranked.reduce((sum, app) => sum + (app.atsEvaluation?.totalScore || 0), 0) / ranked.length)
      : 0,
    strongMatches: ranked.filter((app) => (app.atsEvaluation?.totalScore || 0) >= 80).length,
    mediumMatches: ranked.filter((app) => {
      const score = app.atsEvaluation?.totalScore || 0;
      return score >= 60 && score < 80;
    }).length,
    weakMatches: ranked.filter((app) => (app.atsEvaluation?.totalScore || 0) < 60).length,
  };

  return { ranked, summary };
};

export default function ApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const [token] = useState<string | null>(() => (typeof window === 'undefined' ? null : localStorage.getItem('token')));
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<AtsSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !jobId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const jobRes = await jobService.getJobById(token, jobId) as { data: Job };
        setJob(jobRes.data);

        try {
          const rankingRes = await applicationService.getRankedApplicants(token, jobId) as {
            data: Application[];
            summary: AtsSummary;
          };

          setApplications(rankingRes.data || []);
          setSummary(rankingRes.summary || emptySummary);
        } catch (rankingError) {
          const rankingMessage = rankingError instanceof Error ? rankingError.message : 'Failed to load applicants';

          if (rankingMessage === 'Route not found') {
            const applicantsRes = await applicationService.getJobApplicants(token, jobId, { limit: 1000 }) as {
              data: Application[];
            };
            const fallback = buildFallbackRanking(applicantsRes.data || []);
            setApplications(fallback.ranked);
            setSummary(fallback.summary);
          } else {
            throw rankingError;
          }
        }

        setError('');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load applicants';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, token]);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    if (!token) return;

    try {
      setUpdatingStatus(applicationId);
      await applicationService.updateApplicationStatus(token, applicationId, newStatus);
      setApplications((current) =>
        current.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
      );
      setError('');
      showToast.statusUpdated();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      showToast.apiError(message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="hiring_manager">
        <HiringManagerLayout>
          <div className="p-8 text-center text-gray-600">Loading ranked applicants...</div>
        </HiringManagerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700"
              >
                Back
              </button>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {job?.title || 'Job'} Applicant Rankings
              </h1>
              <p className="mt-2 max-w-2xl text-gray-600">
                ATS ranking for {job?.company || 'this job'} with keyword, skill, and resume quality signals.
              </p>
            </div>
            <ATSScoreBadge score={summary.averageAtsScore} recommendation="Average ATS Score" />
          </div>

          {error ? (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Total Applicants</div>
              <div className="mt-3 text-4xl font-bold text-gray-900">{summary.totalApplicants}</div>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-6 shadow-sm ring-1 ring-emerald-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Strong Matches</div>
              <div className="mt-3 text-4xl font-bold text-emerald-800">{summary.strongMatches}</div>
            </div>
            <div className="rounded-2xl bg-amber-50 p-6 shadow-sm ring-1 ring-amber-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Medium Matches</div>
              <div className="mt-3 text-4xl font-bold text-amber-800">{summary.mediumMatches}</div>
            </div>
            <div className="rounded-2xl bg-rose-50 p-6 shadow-sm ring-1 ring-rose-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-700">Weak Matches</div>
              <div className="mt-3 text-4xl font-bold text-rose-800">{summary.weakMatches}</div>
            </div>
          </div>

          {applications.length > 0 ? (
            <>
              <div className="mb-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Top Candidate Score Cards</h2>
                    <p className="mt-1 text-sm text-gray-600">The highest ATS-ranked applicants for this role.</p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {applications.slice(0, 3).map((application) => (
                    <CandidateScoreCard
                      key={application._id}
                      application={application}
                      jobId={jobId}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Ranking Table</h2>
                  <p className="mt-1 text-sm text-gray-600">Sorted highest ATS score first.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead className="border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                      <tr>
                        <th className="px-4 py-3">Rank</th>
                        <th className="px-4 py-3">Candidate</th>
                        <th className="px-4 py-3">ATS Score</th>
                        <th className="px-4 py-3">Matched Skills</th>
                        <th className="px-4 py-3">Keyword Match</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Documents</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => {
                        const score = app.atsEvaluation?.totalScore || 0;
                        const matchedSkills = app.atsEvaluation?.matchedSkills || [];
                        const keywordMatch = app.atsEvaluation?.keywordAnalysis?.keywordMatchPercentage || 0;

                        return (
                          <tr key={app._id} className="border-b border-gray-100 align-top">
                            <td className="px-4 py-5">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                                #{app.rank || '-'}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="font-semibold text-gray-900">{app.studentId?.name || 'Unknown Candidate'}</div>
                              <div className="mt-1 text-sm text-gray-600">{app.studentId?.email || 'No email available'}</div>
                              <div className="mt-3 text-xs text-gray-500">
                                Applied {new Date(app.appliedAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="mb-3">
                                <ATSScoreBadge score={score} recommendation={app.atsEvaluation?.recommendation} />
                              </div>
                              <ATSProgressBar label="Overall" value={score} colorClass="bg-blue-600" />
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex max-w-xs flex-wrap gap-2">
                                {matchedSkills.length > 0 ? (
                                  matchedSkills.slice(0, 6).map((skill) => (
                                    <span key={skill} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-sm text-gray-500">No matching skills found</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <ATSProgressBar label="Keywords" value={keywordMatch} colorClass="bg-emerald-600" />
                            </td>
                            <td className="px-4 py-5">
                              <StatusBadge status={app.status} />
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex flex-col gap-2">
                                {app.resumeUrl ? (
                                  <ResumeViewer resumeUrl={app.resumeUrl} applicantName={app.studentId?.name || 'Candidate'} />
                                ) : null}
                                {app.answers && app.answers.length > 0 ? (
                                  <AnswersViewer answers={app.answers} applicantName={app.studentId?.name || 'Candidate'} />
                                ) : null}
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex flex-col gap-3">
                                <Link
                                  href={`/hiring-manager/applicants/${jobId}/${app._id}`}
                                  className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                                >
                                  View Details
                                </Link>
                                {app.status === 'Applied' ? (
                                  <button
                                    onClick={() => handleStatusChange(app._id, 'Reviewing')}
                                    disabled={updatingStatus === app._id}
                                    className="text-left text-sm font-semibold text-indigo-700 disabled:opacity-50"
                                  >
                                    {updatingStatus === app._id ? 'Updating...' : 'Move to Review'}
                                  </button>
                                ) : null}
                                {app.status === 'Reviewing' ? (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(app._id, 'Accepted')}
                                      disabled={updatingStatus === app._id}
                                      className="text-left text-sm font-semibold text-emerald-700 disabled:opacity-50"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(app._id, 'Rejected')}
                                      disabled={updatingStatus === app._id}
                                      className="text-left text-sm font-semibold text-rose-700 disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-600">
              No applicants yet for this job.
            </div>
          )}
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
