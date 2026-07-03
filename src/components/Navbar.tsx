'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
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
                    <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition">
                      Search Jobs
                    </Link>
                    <Link href="/applications" className="text-gray-700 hover:text-blue-600 transition">
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
  );
};
