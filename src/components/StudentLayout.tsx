'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { BriefcaseBusiness, FileText, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Settings, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentLayoutProps {
  children: ReactNode;
}

export const StudentLayout = ({ children }: StudentLayoutProps) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Jobs', href: '/student/jobs', icon: BriefcaseBusiness },
    { label: 'ATS Reports', href: '/student/applications', icon: FileText },
    { label: 'Profile', href: '/student/profile', icon: UserRound },
    { label: 'Settings', href: '/student/profile', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(135deg,_hsl(var(--background))_0%,_hsl(var(--muted))_100%)]">
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-20 z-40 border-border/70 bg-background/95 shadow-sm md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </Button>

      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-border/70 bg-background/95 px-4 py-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.48)] backdrop-blur transition-transform duration-300 md:translate-x-0 md:relative md:h-auto md:w-72`}
      >
        <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Candidate workspace</p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Student Portal</h2>
          <p className="mt-1 text-sm text-muted-foreground">Stay organized across roles, applications, and ATS signals.</p>
        </div>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
    </div>
  );
};
