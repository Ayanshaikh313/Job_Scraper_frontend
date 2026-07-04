import Link from "next/link";
import * as React from "react";
import { LayoutGrid, Settings2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface AppSidebarProps extends React.ComponentProps<"aside"> {
  sections?: SidebarSection[];
  footer?: React.ReactNode;
}

function AppSidebar({ sections = [], footer, className, ...props }: AppSidebarProps) {
  const fallbackSections: SidebarSection[] = [
    {
      title: "Workspace",
      items: [
        { label: "Overview", href: "/", icon: <LayoutGrid className="size-4" />, active: true },
        { label: "Automations", href: "/automation", icon: <Sparkles className="size-4" /> },
      ],
    },
    {
      title: "Settings",
      items: [{ label: "Preferences", href: "/settings", icon: <Settings2 className="size-4" /> }],
    },
  ];

  const resolvedSections = sections.length ? sections : fallbackSections;

  return (
    <aside
      data-slot="app-sidebar"
      className={cn("flex h-full w-72 flex-col border-r border-border/70 bg-sidebar text-sidebar-foreground", className)}
      {...props}
    >
      <div className="flex items-center gap-3 border-b border-border/70 px-4 py-4">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Operations Hub</p>
          <p className="text-xs text-muted-foreground">Modern workspace</p>
        </div>
      </div>
      <div className="flex-1 space-y-6 px-3 py-4">
        {resolvedSections.map((section) => (
          <div key={section.title ?? "section"}>
            {section.title ? <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{section.title}</p> : null}
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button variant={item.active ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {footer ? <div className="border-t border-border/70 p-4">{footer}</div> : null}
    </aside>
  );
}

export { AppSidebar };
