type LoadingSkeletonProps = {
  className?: string;
};

export const LoadingSkeleton = ({ className = "h-4 w-full" }: LoadingSkeletonProps) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
);

export const TableSkeleton = ({ rows = 6 }: { rows?: number }) => (
  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className="grid grid-cols-12 gap-2">
        <LoadingSkeleton className="col-span-5 h-8" />
        <LoadingSkeleton className="col-span-2 h-8" />
        <LoadingSkeleton className="col-span-3 h-8" />
        <LoadingSkeleton className="col-span-2 h-8" />
      </div>
    ))}
  </div>
);
