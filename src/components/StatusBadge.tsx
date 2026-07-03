import { ApplicationStatus } from '@/types';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    Applied: { bg: 'bg-blue-100', text: 'text-blue-800' },
    Reviewing: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    Accepted: { bg: 'bg-green-100', text: 'text-green-800' },
    Rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  };

  const config = statusConfig[status];

  return (
    <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-semibold`}>
      {status}
    </span>
  );
};
