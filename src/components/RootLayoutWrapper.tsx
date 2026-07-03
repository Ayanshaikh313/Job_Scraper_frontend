'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';

interface RootLayoutWrapperProps {
  children: ReactNode;
}

export const RootLayoutWrapper = ({ children }: RootLayoutWrapperProps) => {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthProvider>
      {/* Simple navbar that doesn't use context */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">JobScraper</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
                    Login
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition">
                    Profile
                  </Link>

                  {/* Role-based navigation */}
                  {user?.role === 'student' && (
                    <>
                      <Link href="/student/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                        Dashboard
                      </Link>
                      <Link href="/student/jobs" className="text-gray-700 hover:text-blue-600 transition">
                        Search Jobs
                      </Link>
                      <Link href="/student/applications" className="text-gray-700 hover:text-blue-600 transition">
                        My Applications
                      </Link>
                    </>
                  )}

                  {user?.role === 'hiring_manager' && (
                    <>
                      <Link href="/jobs/create" className="text-gray-700 hover:text-blue-600 transition">
                        Post Job
                      </Link>
                      <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                        Dashboard
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center">&copy; 2024 Job Scraper Platform. All rights reserved.</p>
        </div>
      </footer>
    </AuthProvider>
  );
};
