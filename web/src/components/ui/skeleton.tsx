import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "shimmer relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.025]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
