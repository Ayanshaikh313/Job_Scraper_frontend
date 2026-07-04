'use client';

import Link from 'next/link';
import { Application } from '@/types';
import { ATSScoreBadge } from './ATSScoreBadge';

interface CandidateScoreCardProps {
  application: Application;
  jobId: string;
}

export const CandidateScoreCard = ({ application, jobId }: CandidateScoreCardProps) => {
  const candidateName = application.studentId?.name || 'Unknown Candidate';
  const candidateEmail = application.studentId?.email || 'No email available';
  const score = application.atsEvaluation?.totalScore;
  const matchedSkills = application.atsEvaluation?.matchedSkills || [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{candidateName}</h3>
          <p className="text-sm text-gray-600">{candidateEmail}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Rank #{application.rank || '-'}
          </div>
          <ATSScoreBadge score={score} recommendation={application.atsEvaluation?.recommendation} />
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-700">
        <span className="font-semibold text-gray-900">Matched skills:</span>{' '}
        {matchedSkills.length > 0 ? matchedSkills.slice(0, 5).join(', ') : 'No job-specific matches detected yet.'}
      </div>

      <Link
        href={`/hiring-manager/applicants/${jobId}/${application._id}`}
        className="inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        View ATS Details
      </Link>
    </div>
  );
};
