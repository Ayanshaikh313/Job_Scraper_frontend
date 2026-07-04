interface ATSProgressBarProps {
  label: string;
  value: number;
  max?: number;
  colorClass?: string;
}

export const ATSProgressBar = ({
  label,
  value,
  max = 100,
  colorClass = 'bg-blue-600',
}: ATSProgressBarProps) => {
  const safeValue = Math.max(0, Math.min(value, max));
  const width = `${(safeValue / max) * 100}%`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
        <span>{label}</span>
        <span>{safeValue}/{max}</span>
      </div>
      <div className="h-3 rounded-full bg-gray-200">
        <div className={`h-3 rounded-full ${colorClass}`} style={{ width }} />
      </div>
    </div>
  );
};
