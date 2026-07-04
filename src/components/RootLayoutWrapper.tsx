'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';

interface RootLayoutWrapperProps {
  children: ReactNode;
}

export const RootLayoutWrapper = ({ children }: RootLayoutWrapperProps) => {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateAuthState = () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    updateAuthState();

    // Listen for storage changes (e.g., from other tabs or when logging in/out)
    const handleStorageChange = () => {
      updateAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same tab
    window.addEventListener('authChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setMobileMenuOpen(false);
    window.location.href = '/';
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">JobScraper</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                    Login
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition font-medium">
                    Profile
                  </Link>

                  {/* Role-based navigation */}
                  {user?.role === 'student' && (
                    <>
                      <Link href="/student/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium">
                        Dashboard
                      </Link>
                      <Link href="/student/jobs" className="text-gray-700 hover:text-blue-600 transition font-medium">
                        Search Jobs
                      </Link>
                      <Link href="/student/applications" className="text-gray-700 hover:text-blue-600 transition font-medium">
                        Applications
                      </Link>
                    </>
                  )}

                  {user?.role === 'hiring_manager' && (
                    <>
                      <Link href="/hiring-manager/dashboard" className="text-gray-700 hover:text-blue-600 transition font-medium">
                        Dashboard
                      </Link>
                      <Link href="/hiring-manager/jobs" className="text-gray-700 hover:text-blue-600 transition font-medium">
                        My Jobs
                      </Link>
                      <Link href="/hiring-manager/jobs/create" className="text-gray-700 hover:text-blue-600 transition font-medium">
                        Post Job
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Profile
                  </Link>

                  {user?.role === 'student' && (
                    <>
                      <Link
                        href="/student/dashboard"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/student/jobs"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Search Jobs
                      </Link>
                      <Link
                        href="/student/applications"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        My Applications
                      </Link>
                    </>
                  )}

                  {user?.role === 'hiring_manager' && (
                    <>
                      <Link
                        href="/hiring-manager/dashboard"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/hiring-manager/jobs"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        My Jobs
                      </Link>
                      <Link
                        href="/hiring-manager/jobs/create"
                        onClick={closeMobileMenu}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        Post Job
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
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
