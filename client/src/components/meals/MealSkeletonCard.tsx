interface MealSkeletonCardProps {
  className?: string;
}

export function MealSkeletonCard({ className = "" }: MealSkeletonCardProps) {
  return (
    <div
      className={`relative bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full select-none animate-pulse ${className}`}
    >
      {/* Top Image Area */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-neutral-900">
        {/* Calorie Badge Skeleton */}
        <div className="absolute top-3 left-3 z-10">
          <div className="h-6 w-20 rounded-full bg-neutral-800/90 border border-white/10 shadow-lg" />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex flex-col grow space-y-3 -mt-2 relative z-10 bg-neutral-950">
        {/* Meal Name Skeleton */}
        <div className="h-6 sm:h-7 w-3/4 rounded-md bg-neutral-800/80" />

        {/* Description Skeleton (2 lines) */}
        <div className="space-y-1.5 grow pt-0.5">
          <div className="h-3 w-full rounded bg-neutral-800/60" />
          <div className="h-3 w-4/5 rounded bg-neutral-800/40" />
        </div>

        {/* Ingredients Preview Tags Skeleton */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <div className="h-5 w-16 rounded-full bg-white/5 border border-white/10" />
          <div className="h-5 w-20 rounded-full bg-white/5 border border-white/10" />
          <div className="h-5 w-14 rounded-full bg-white/5 border border-white/10" />
        </div>

        {/* Action Button Footer Skeleton */}
        <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 sm:gap-4">
          {/* Daily Plan Button Skeleton */}
          <div className="h-8.5 w-26 sm:w-30 rounded-full bg-neutral-900 border border-white/15" />
          {/* View Details Button Skeleton */}
          <div className="h-8.5 w-26 sm:w-30 rounded-full bg-neutral-800/90 border border-white/20" />
        </div>
      </div>
    </div>
  );
}

interface MealSkeletonGridProps {
  count?: number;
  className?: string;
}

export function MealSkeletonGrid({
  count = 6,
  className = "",
}: MealSkeletonGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 ${className}`}
    >
      {Array.from({ length: count }, (_, idx) => (
        <MealSkeletonCard key={idx} />
      ))}
    </div>
  );
}

export default MealSkeletonCard;
