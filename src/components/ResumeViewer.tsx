'use client';

interface ResumeViewerProps {
  resumeUrl: string;
  applicantName: string;
}

const getResumeAssetUrl = (resumeUrl: string) => {
  if (resumeUrl.startsWith('http')) {
    return resumeUrl;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const backendBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  return `${backendBaseUrl}${resumeUrl}`;
};

export const ResumeViewer = ({ resumeUrl, applicantName }: ResumeViewerProps) => {
  const handleViewResume = () => {
    const fullUrl = getResumeAssetUrl(resumeUrl);

    // Open PDF in new tab
    window.open(fullUrl, '_blank');
  };

  return (
    <>
      <div className="flex gap-1">
        <button
          onClick={handleViewResume}
          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
          title="Open resume in new tab"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
          <span className="hidden sm:inline">{applicantName} Resume</span>
        </button>
      </div>
    </>
  );
};
