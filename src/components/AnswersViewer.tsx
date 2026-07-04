'use client';

import { useState } from 'react';
import { ApplicationAnswer } from '@/types';

interface AnswersViewerProps {
  answers: ApplicationAnswer[];
  applicantName: string;
}

export const AnswersViewer = ({ answers, applicantName }: AnswersViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* View Answers Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
            clipRule="evenodd"
          />
        </svg>
        View Answers ({answers.length})
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Screening Answers</h2>
                <p className="text-gray-600 text-sm mt-1">{applicantName}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {answers.length > 0 ? (
                answers.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.question}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{item.answer}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No answers provided</p>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
