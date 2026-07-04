"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface AppNavbarProps extends React.HTMLAttributes<HTMLElement> {
  isAuthenticated?: boolean;
  user?: any;
  onLogout?: () => void;
}

export function AppNavbar({ isAuthenticated, user, onLogout, className, ...props }: AppNavbarProps) {
  const pathname = usePathname() || "/";

  const nav = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/student/jobs" },
    { label: "ATS Resume Scanner", href: "/" },
    { label: "Dashboard", href: user?.role === 'hiring_manager' ? "/hiring-manager/dashboard" : "/student/dashboard" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      data-slot="app-navbar"
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur bg-background/80",
        "shadow-sm",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow">JS</div>
            <span className="hidden text-sm font-semibold text-foreground sm:block">Job Scraper</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex md:gap-4 lg:gap-6">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
                )}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex md:items-center md:gap-3">
            <ThemeToggle />
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                  <LogIn className="size-4" />
                  Login
                </Link>
                <Link href="/register" className="ml-2">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            ) : (
              <>
                <Badge className="mr-2">{user?.name ?? 'You'}</Badge>
                <Button variant="ghost" size="sm" onClick={onLogout}>Logout</Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">JS</div>
                    <div className="text-sm font-semibold">Job Scraper</div>
                  </div>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close menu">
                      <X className="size-5" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <ThemeToggle />
                  {nav.map((item) => {
                    const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-base font-medium",
                          active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <div className="mt-4 flex flex-col gap-2">
                    {!isAuthenticated ? (
                      <>
                        <Link href="/login" className="block w-full">
                          <Button variant="ghost" className="w-full">Login</Button>
                        </Link>
                        <Link href="/register" className="block w-full">
                          <Button className="w-full">Sign up</Button>
                        </Link>
                      </>
                    ) : (
                      <Button variant="ghost" onClick={onLogout}>Logout</Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
