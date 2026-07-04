import * as React from "react";
import { Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = <Sparkles className="size-5" />,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/70 px-8 py-12 text-center shadow-sm",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {children}
      {actionLabel && actionHref ? (
        <a href={actionHref} className={cn(buttonVariants({ variant: "default" }), "mt-6")}>
          {actionLabel}
        </a>
      ) : null}
    </div>
  );
}

export { EmptyState };
