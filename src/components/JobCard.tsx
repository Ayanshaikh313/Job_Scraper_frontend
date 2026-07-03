import Link from 'next/link';
import { Job, ExternalJob } from '@/types';

interface JobCardProps {
  job: Job | ExternalJob;
  isExternal?: boolean;
}

export const JobCard = ({ job, isExternal = false }: JobCardProps) => {
  // Check if it's an external job
  const isExt = 'source' in job;

  if (isExternal || isExt) {
    const externalJob = job as ExternalJob;
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{externalJob.title}</h3>
            <p className="text-gray-600">{externalJob.company}</p>
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            {externalJob.source}
          </span>
        </div>
        <p className="text-gray-600 mb-4">📍 {externalJob.location}</p>
        <a
          href={externalJob.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Apply Now →
        </a>
      </div>
    );
  }

  // Internal job
  const internalJob = job as Job;
  return (
    <Link href={`/student/jobs/${internalJob._id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{internalJob.title}</h3>
            <p className="text-gray-600">{internalJob.company}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {internalJob.employmentType}
          </span>
        </div>
        <p className="text-gray-600 mb-2">📍 {internalJob.location}</p>
        <p className="text-gray-600 mb-4">💰 {internalJob.salary}</p>
        <button className="text-blue-600 hover:text-blue-700 font-semibold">
          View Details →
        </button>
      </div>
    </Link>
  );
};
