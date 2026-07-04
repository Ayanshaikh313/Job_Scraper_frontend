'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface HiringManagerLayoutProps {
  children: ReactNode;
}

export const HiringManagerLayout = ({ children }: HiringManagerLayoutProps) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/hiring-manager/dashboard' },
    { label: 'My Jobs', href: '/hiring-manager/jobs' },
    { label: 'Post Job', href: '/hiring-manager/jobs/create' },
    { label: 'Profile', href: '/hiring-manager/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Hiring Manager</h2>
        </div>
        <nav className="space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};
