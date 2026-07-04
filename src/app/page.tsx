import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Search,
    title: 'Job Scraping',
    description: 'Discover relevant opportunities across public and partner sources with AI-ranked relevance.',
  },
  {
    icon: FileCheck2,
    title: 'ATS Scoring',
    description: 'Surface keyword gaps and improve every application with a clear, actionable score.',
  },
  {
    icon: Bot,
    title: 'Resume Analysis',
    description: 'Turn every upload into a structured profile with strengths, skills, and growth signals.',
  },
  {
    icon: Users,
    title: 'Applicant Tracking',
    description: 'Keep candidates moving through your pipeline with modern collaborative workflows.',
  },
  {
    icon: BarChart3,
    title: 'Recruiter Dashboard',
    description: 'Monitor talent funnels, hiring velocity, and hiring-manager activity in one view.',
  },
];

const stats = [
  { value: '24k+', label: 'Active Jobs' },
  { value: '182k', label: 'Resumes Analyzed' },
  { value: '4.8k', label: 'Companies' },
  { value: '91%', label: 'ATS Reports' },
];

const testimonials = [
  {
    quote:
      'The interface feels like a premium recruiting OS. We cut our screening time in half without losing quality.',
    name: 'Maya Chen',
    role: 'Head of Talent, Northstar Labs',
  },
  {
    quote:
      'The ATS score cards are incredibly clear. My candidates now understand exactly how to improve their applications.',
    name: 'Daniel Ruiz',
    role: 'Career Coach, Elevate Collective',
  },
  {
    quote:
      'It feels like Linear for recruiting—fast, polished, and thoughtful. We use it every day for our pipeline.',
    name: 'Aisha Brooks',
    role: 'Hiring Manager, BrightPath',
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_32%),linear-gradient(135deg,_rgba(245,247,255,0.98)_0%,_rgba(255,255,255,0.96)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),_transparent_32%),linear-gradient(135deg,_rgba(9,12,22,0.98)_0%,_rgba(12,15,28,0.96)_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-6 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-primary">
              <Sparkles className="mr-2 size-3.5" />
              AI-powered job scraper & ATS platform
            </Badge>

            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Hire faster, apply smarter, and turn every resume into momentum.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              A premium recruiting workspace for students, job seekers, and hiring teams—combining job discovery, ATS intelligence, and applicant tracking in one elegant experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register?role=student"
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl',
                  'bg-primary text-primary-foreground',
                )}
              >
                Start free
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="/register?role=hiring_manager"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background/80 px-6 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-muted"
              >
                <PlayCircle className="mr-2 size-4" />
                Watch demo
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Resume feedback in minutes
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/70 px-3 py-1.5">
                <CheckCircle2 className="size-4 text-primary" />
                Recruiter-ready analytics
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -translate-y-6 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-violet-500/20 blur-3xl" />
            <Card className="relative overflow-hidden border-border/70 bg-background/80 p-0 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
              <CardHeader className="border-b border-border/70 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">ATS Resume Analysis</CardTitle>
                    <CardDescription>Live preview • 92% match score</CardDescription>
                  </div>
                  <Badge variant="success">Live</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Resume match</p>
                      <p className="text-xs text-muted-foreground">Senior Product Designer • React • AI</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">92/100</div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-border">
                    <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-primary to-violet-500" />
                  </div>
                </div>

                <LoadingState label="Scanning keywords and ATS alignment…" rows={3} className="rounded-2xl border border-border/70 bg-card p-4" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-semibold">Top keywords</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['React', 'Next.js', 'Leadership', 'Figma', 'AI'].map((item) => (
                        <Badge key={item} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm font-semibold">Recommended next steps</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><Zap className="size-4 text-primary" />Add roadmap metrics</li>
                      <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />Strengthen product strategy keywords</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Platform capabilities</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Designed for modern recruiting teams.
              </h2>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              From job discovery to candidate evaluation, every workflow is designed to feel as polished as the best SaaS products in the market.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group h-full border-border/70 bg-background/70 transition hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                    <CardDescription className="mt-2 text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-border/70 bg-background/70 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.25)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">ATS demo</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                See the score before the recruiter does.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Surface the strongest matches instantly with a premium scorecard, ranked keyword insights, and a fast path to improvement.
            </p>
            <div className="rounded-2xl border border-border/70 bg-muted/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Applicant summary</p>
                  <p className="text-sm text-muted-foreground">Senior Product Designer</p>
                </div>
                <Badge variant="warning">Needs polish</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ['Experience fit', '84%'],
                  ['Keyword density', '76%'],
                  ['Leadership signal', '91%'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold text-foreground">{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-border">
                      <div className="h-2 rounded-full bg-gradient-to-r from-primary to-violet-500" style={{ width: value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Keyword analysis preview</p>
                <p className="text-sm text-muted-foreground">Top opportunities to improve fit</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <TrendingUp className="mr-2 size-4" />
                Optimize
              </Button>
            </div>
            <div className="mt-5 space-y-4">
              {[
                ['Product strategy', 92],
                ['User research', 84],
                ['AI copilots', 78],
                ['Leadership', 68],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border/70 bg-background/80 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-border">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/70 bg-background/70">
              <CardContent className="p-6">
                <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Loved by teams</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Trusted by high-growth hiring teams.
              </h2>
            </div>
            <p className="max-w-2xl text-muted-foreground">
              Modern recruiting teams use our workspace to move faster, without sacrificing clarity or candidate quality.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border/70 bg-background/70">
                <CardContent className="p-6">
                  <p className="text-base leading-7 text-foreground">“{testimonial.quote}”</p>
                  <div className="mt-6">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-primary/10 via-background/70 to-violet-500/10 p-8 shadow-[0_25px_80px_-35px_rgba(99,102,241,0.35)] sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Start today</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Launch a better recruiting experience this week.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Join teams that care about clarity, speed, and delight. Build a stronger pipeline with AI-powered workflows.
              </p>
            </div>
            <div className="w-full max-w-xl rounded-[1.5rem] border border-border/70 bg-background/80 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input placeholder="Work email" className="h-11 flex-1" />
                <Button className="h-11 rounded-full">
                  <Upload className="mr-2 size-4" />
                  Upload resume
                </Button>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">No credit card required • Free for early access teams</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer is provided globally in RootLayoutWrapper; removed duplicate here */}
    </main>
  );
}
