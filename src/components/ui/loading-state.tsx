import * as React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps extends React.ComponentProps<"div"> {
  label?: string;
  rows?: number;
}

function LoadingState({ label = "Loading…", rows = 3, className, ...props }: LoadingStateProps) {
  return (
    <div data-slot="loading-state" className={cn("space-y-4", className)} {...props}>
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <Skeleton className="mb-3 h-5 w-40" />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className={cn("mt-3 h-4", index === rows - 1 ? "w-3/4" : "w-full")} />
        ))}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export { LoadingState };
