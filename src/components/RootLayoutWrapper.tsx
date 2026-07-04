'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContext';
import Link from 'next/link';
import { AppNavbar } from '@/components/layout/app-navbar';

interface RootLayoutWrapperProps {
  children: ReactNode;
}

export const RootLayoutWrapper = ({ children }: RootLayoutWrapperProps) => {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    window.location.href = '/';
  };

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

      <div>
        {/* Use the redesigned AppNavbar component */}
        {/* AppNavbar handles mobile sheet, theme toggle, and responsive nav */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <AppNavbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
      </div>

      <main className="flex-1">{children}</main>

      <footer className="mt-16">
        <div className="border-t border-border/70 bg-background/90">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">JS</div>
              <div>
                <p className="text-sm font-semibold text-foreground">Job Scraper Platform</p>
                <p className="text-xs text-muted-foreground">Modern recruiting for ambitious teams</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/login" className="transition hover:text-foreground">Login</Link>
              <Link href="/register" className="transition hover:text-foreground">Register</Link>
              <Link href="/student/jobs" className="transition hover:text-foreground">Explore jobs</Link>
            </div>
          </div>
        </div>

        <div className="bg-background/95 border-t border-border/60">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            © 2026 Job Scraper Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </AuthProvider>
  );
};
