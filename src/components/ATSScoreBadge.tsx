interface ATSScoreBadgeProps {
  score?: number | null;
  recommendation?: string;
}

const getScoreStyles = (score?: number | null) => {
  if (score == null) {
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }

  if (score >= 80) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  }

  if (score >= 60) {
    return 'bg-amber-100 text-amber-800 border-amber-200';
  }

  return 'bg-rose-100 text-rose-800 border-rose-200';
};

const getScoreLabel = (score?: number | null) => {
  if (score == null) {
    return 'ATS Pending';
  }

  return `ATS ${score}/100`;
};

export const ATSScoreBadge = ({ score, recommendation }: ATSScoreBadgeProps) => (
  <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${getScoreStyles(score)}`}>
    <span>{getScoreLabel(score)}</span>
    {recommendation ? <span className="opacity-80">{recommendation}</span> : null}
  </div>
);
