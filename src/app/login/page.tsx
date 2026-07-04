'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { authService } from '@/services/api';
import { showToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        setIsAuthenticated(true);
        const userData = JSON.parse(storedUser);
        setUser(userData);

        if (userData.role === 'student') {
          router.push('/student/dashboard');
        } else if (userData.role === 'hiring_manager') {
          router.push('/hiring-manager/dashboard');
        }
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response: any = await authService.login(email, password);

      if (response.token && response.data) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        showToast.loginSuccess();
        window.dispatchEvent(new Event('authChange'));
        setSuccessMessage('Welcome back! Redirecting you to your dashboard…');

        window.setTimeout(() => {
          if (response.data.role === 'student') {
            router.push('/student/dashboard');
          } else if (response.data.role === 'hiring_manager') {
            router.push('/hiring-manager/dashboard');
          }
        }, 650);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      showToast.apiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_38%),linear-gradient(135deg,_hsl(var(--background))_0%,_hsl(var(--muted))_100%)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="flex-1 rounded-3xl border border-border/70 bg-card/80 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.4)] backdrop-blur xl:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Secure access for modern recruiting
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Welcome back to the platform that keeps hiring moving.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Sign in to review applicants, manage jobs, and keep every recruitment workflow in sync.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'Role-based dashboards for students and hiring teams',
              'A polished ATS experience with instant status updates',
              'Protected access with secure session handling',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/70 p-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full max-w-xl border-border/70 bg-background/95 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
          <CardHeader className="space-y-3 px-6 pt-8 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-foreground">Log in</CardTitle>
                <CardDescription className="mt-2 text-sm text-muted-foreground">
                  Use your email and password to continue.
                </CardDescription>
              </div>
              <div className="rounded-full border border-border bg-muted/70 p-2.5 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-8">
            {error ? (
              <div className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                {error}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                {successMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="h-11 pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="h-11 pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="h-11 w-full gap-2" size="lg">
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-primary transition hover:underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
