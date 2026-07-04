import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface AppNavbarProps extends React.ComponentProps<"header"> {
  title?: string;
  description?: string;
  links?: NavItem[];
  actions?: React.ReactNode;
}

function AppNavbar({ title = "Job Scraper", description, links = [], actions, className, ...props }: AppNavbarProps) {
  return (
    <header
      data-slot="app-navbar"
      className={cn("sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl", className)}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            JS
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{title}</p>
            {description ? <p className="truncate text-xs text-muted-foreground">{description}</p> : null}
          </div>
        </div>
        {links.length ? (
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((item) => (
              <Link key={item.href} href={item.href} className={cn("rounded-full px-3 py-2 text-sm font-medium transition hover:bg-muted", item.active && "bg-muted text-foreground") }>
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex items-center gap-2">{actions ?? <Button size="sm">Get started</Button>}</div>
      </div>
    </header>
  );
}

export { AppNavbar };
