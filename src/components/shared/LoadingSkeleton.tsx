import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "card" | "table" | "chart" | "metric";
  count?: number;
}

export const SkeletonCard = ({ lines = 4 }: { lines?: number }) => (
  <div className="glass rounded-xl p-5 space-y-3">
    <Skeleton className="h-4 w-1/3" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-3 w-full" style={{ width: `${85 - i * 10}%` }} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="glass rounded-xl overflow-hidden">
    <div className="p-4 border-b border-border/50 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="p-4 border-b border-border/50 flex gap-4">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-3 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="glass rounded-xl p-5 space-y-3">
    <Skeleton className="h-4 w-1/4" />
    <div className="flex items-end gap-1 h-48">
      {Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${20 + Math.random() * 80}%` }} />
      ))}
    </div>
  </div>
);

export const SkeletonMetric = () => (
  <div className="glass rounded-xl p-5 space-y-2">
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-8 w-2/3" />
    <Skeleton className="h-2 w-1/3" />
  </div>
);

const LoadingSkeleton = ({ type = "card", count = 1 }: LoadingSkeletonProps) => {
  const Component = {
    card: SkeletonCard,
    table: SkeletonTable,
    chart: SkeletonChart,
    metric: SkeletonMetric,
  }[type];

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
