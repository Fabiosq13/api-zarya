import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-2xl border border-white/[0.05] bg-white/[0.03]", className)}
      {...props}
    />
  );
}

export { Skeleton };
