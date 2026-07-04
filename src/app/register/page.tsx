'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, CircleUserRound, Lock, Mail, Sparkles, UserRound } from 'lucide-react';
import { authService } from '@/services/api';
import { showToast } from '@/utils/toast';
import type { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response: any = await authService.register({
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      if (response.token && response.data) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));

        showToast.registerSuccess();
        window.dispatchEvent(new Event('authChange'));
        setSuccessMessage('Account created. Redirecting you to your workspace…');

        window.setTimeout(() => {
          if (response.data.role === 'student') {
            router.push('/student/dashboard');
          } else if (response.data.role === 'hiring_manager') {
            router.push('/hiring-manager/dashboard');
          }
        }, 650);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
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
            Built for ambitious teams and candidates
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Create your account and launch your workflow in minutes.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Choose the experience that fits your role and get immediate access to hiring tools, applications, and candidate insights.
          </p>

          <div className="mt-8 rounded-3xl border border-border/60 bg-background/70 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Flexible access</p>
                <p className="text-sm text-muted-foreground">Students can discover roles and apply; hiring managers can publish and review jobs.</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-xl border-border/70 bg-background/95 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
          <CardHeader className="space-y-3 px-6 pt-8 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-foreground">Create account</CardTitle>
                <CardDescription className="mt-2 text-sm text-muted-foreground">
                  Join Job Scraper and start hiring or applying with confidence.
                </CardDescription>
              </div>
              <div className="rounded-full border border-border bg-muted/70 p-2.5 text-primary">
                <CircleUserRound className="h-5 w-5" />
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
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Alex Morgan"
                    className="h-11 pl-10"
                    autoComplete="name"
                  />
                </div>
              </div>

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

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">I am joining as</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: 'student' as UserRole,
                      title: 'Student',
                      description: 'Find roles and apply',
                      icon: <CircleUserRound className="h-4 w-4" />,
                    },
                    {
                      value: 'hiring_manager' as UserRole,
                      title: 'Hiring manager',
                      description: 'Post jobs and review candidates',
                      icon: <BriefcaseBusiness className="h-4 w-4" />,
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        role === option.value
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-background hover:border-primary/40 hover:bg-muted/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span className="font-medium">{option.title}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                    </button>
                  ))}
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
                    placeholder="Create a password"
                    className="h-11 pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    className="h-11 pl-10"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="h-11 w-full gap-2" size="lg">
                {loading ? 'Creating account…' : 'Create account'}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary transition hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
