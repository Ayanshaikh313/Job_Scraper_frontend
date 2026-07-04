'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HiringManagerLayout } from '@/components/HiringManagerLayout';
import { ResumeViewer } from '@/components/ResumeViewer';
import { AnswersViewer } from '@/components/AnswersViewer';
import { ATSScoreBadge } from '@/components/ATSScoreBadge';
import { ATSProgressBar } from '@/components/ATSProgressBar';
import { applicationService } from '@/services/api';
import { showToast } from '@/utils/toast';
import { Application } from '@/types';

const renderSkillSection = (title: string, skills: string[], tone: 'green' | 'rose' | 'slate') => {
  const toneMap = {
    green: 'bg-emerald-100 text-emerald-800',
    rose: 'bg-rose-100 text-rose-800',
    slate: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span key={skill} className={`rounded-full px-3 py-1 text-sm font-semibold ${toneMap[tone]}`}>
              {skill}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-500">No items available.</span>
        )}
      </div>
    </div>
  );
};

export default function ApplicantDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const applicationId = params.applicationId as string;
  const [token] = useState<string | null>(() => (typeof window === 'undefined' ? null : localStorage.getItem('token')));
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      if (!token || !jobId || !applicationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await applicationService.getApplicationDetails(token, jobId, applicationId) as {
          data: Application;
        };
        setApplication(response.data);
        setError('');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load application details';

        if (message === 'Route not found') {
          try {
            const fallbackResponse = await applicationService.getApplicationDetailsById(token, applicationId) as {
              data: Application;
            };
            setApplication(fallbackResponse.data);
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

    fetchApplication();
  }, [applicationId, jobId, token]);

  const handleDownloadReport = async () => {
    if (!token || !application) return;

    try {
      setDownloading(true);
      const blob = await applicationService.downloadApplicationReport(token, application._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(application.studentId?.name || 'candidate').replace(/\s+/g, '-').toLowerCase()}-ats-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast.success('ATS evaluation report downloaded.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download ATS report';
      showToast.apiError(message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="hiring_manager">
        <HiringManagerLayout>
          <div className="p-8 text-center text-gray-600">Loading ATS application details...</div>
        </HiringManagerLayout>
      </ProtectedRoute>
    );
  }

  if (error || !application) {
    return (
      <ProtectedRoute requiredRole="hiring_manager">
        <HiringManagerLayout>
          <div className="p-8">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error || 'Application not found'}
            </div>
          </div>
        </HiringManagerLayout>
      </ProtectedRoute>
    );
  }

  const evaluation = application.atsEvaluation;
  const extractedSkills = application.extractedSkills;
  const keywordAnalysis = evaluation?.keywordAnalysis;
  const scoreBreakdown = evaluation?.scoreBreakdown;
  const resumeMetadata = application.resumeMetadata;

  return (
    <ProtectedRoute requiredRole="hiring_manager">
      <HiringManagerLayout>
        <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_40%,_#eef2ff_100%)] p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <button
                onClick={() => router.back()}
                className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700"
              >
                Back to rankings
              </button>
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {application.studentId?.name || 'Candidate'} ATS Profile
              </h1>
              <p className="mt-2 text-gray-600">
                {application.jobId?.title || 'Job'} at {application.jobId?.company || 'Company'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ATSScoreBadge score={evaluation?.totalScore} recommendation={evaluation?.recommendation} />
              <button
                onClick={handleDownloadReport}
                disabled={downloading}
                className="rounded-full bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {downloading ? 'Preparing Report...' : 'Download PDF Report'}
              </button>
            </div>
          </div>

          {!evaluation ? (
            <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700">
              ATS evaluation is not available yet for this application.
            </div>
          ) : null}

          <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Matched Skills</div>
              <div className="mt-3 text-4xl font-bold text-gray-900">{evaluation?.matchedSkills?.length || 0}</div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Missing Skills</div>
              <div className="mt-3 text-4xl font-bold text-gray-900">{evaluation?.missingSkills?.length || 0}</div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Resume Words</div>
              <div className="mt-3 text-4xl font-bold text-gray-900">{resumeMetadata?.wordCount || 0}</div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Resume Pages</div>
              <div className="mt-3 text-4xl font-bold text-gray-900">{resumeMetadata?.pageCount || 0}</div>
            </div>
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">ATS Score Breakdown</h2>
              <div className="space-y-5">
                <ATSProgressBar label="Keyword Match" value={scoreBreakdown?.keywordMatch || 0} max={40} colorClass="bg-blue-600" />
                <ATSProgressBar label="Skills Match" value={scoreBreakdown?.skillsMatch || 0} max={25} colorClass="bg-emerald-600" />
                <ATSProgressBar label="Experience Match" value={scoreBreakdown?.experienceMatch || 0} max={20} colorClass="bg-amber-500" />
                <ATSProgressBar label="Education Match" value={scoreBreakdown?.educationMatch || 0} max={10} colorClass="bg-fuchsia-600" />
                <ATSProgressBar label="Resume Quality" value={scoreBreakdown?.resumeQuality || 0} max={5} colorClass="bg-slate-700" />
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
              <h2 className="text-2xl font-bold">Resume Information</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Candidate</div>
                  <div className="mt-1 text-lg font-semibold text-white">{application.studentId?.name || 'Unknown Candidate'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</div>
                  <div className="mt-1">{application.studentId?.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Recommendation</div>
                  <div className="mt-1">{evaluation?.recommendation || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Experience Match</div>
                  <div className="mt-1">
                    {evaluation?.experienceAnalysis?.candidateYears || 0} years vs. required {evaluation?.experienceAnalysis?.requiredYears || 0}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Education Match</div>
                  <div className="mt-1">
                    {evaluation?.educationAnalysis?.candidateEducation || 'Not Found'} against {evaluation?.educationAnalysis?.requiredEducation || 'Not specified'}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {application.resumeUrl ? (
                    <ResumeViewer
                      resumeUrl={application.resumeUrl}
                      applicantName={application.studentId?.name || 'Candidate'}
                    />
                  ) : null}
                  {application.answers && application.answers.length > 0 ? (
                    <AnswersViewer
                      answers={application.answers}
                      applicantName={application.studentId?.name || 'Candidate'}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-2">
            {renderSkillSection('Matched Skills', evaluation?.matchedSkills || [], 'green')}
            {renderSkillSection('Missing Skills', evaluation?.missingSkills || [], 'rose')}
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-2">
            {renderSkillSection('Matched Keywords', keywordAnalysis?.matchedKeywords || [], 'green')}
            {renderSkillSection('Missing Keywords', keywordAnalysis?.missingKeywords || [], 'rose')}
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Extracted Skills</h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {renderSkillSection('Frontend', extractedSkills?.frontend || [], 'slate')}
              {renderSkillSection('Backend', extractedSkills?.backend || [], 'slate')}
              {renderSkillSection('Database', extractedSkills?.database || [], 'slate')}
              {renderSkillSection('Cloud', extractedSkills?.cloud || [], 'slate')}
              {renderSkillSection('Tools', extractedSkills?.tools || [], 'slate')}
              {renderSkillSection('All Skills', extractedSkills?.all || [], 'slate')}
            </div>
          </div>
        </div>
      </HiringManagerLayout>
    </ProtectedRoute>
  );
}
