'use client';

interface SkeletonCardProps {
  count?: number;
  columns?: number;
}

export const SkeletonCard = ({ count = 6, columns = 3 }: SkeletonCardProps) => {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  const cards = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className="bg-white rounded-lg shadow-md p-6 animate-pulse"
    >
      <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  ));

  return (
    <div className={`grid gap-6 ${gridClass[columns as keyof typeof gridClass] || gridClass[3]}`}>
      {cards}
    </div>
  );
};
