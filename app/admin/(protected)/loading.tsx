import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-4xl" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-44" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      <div className="mt-8 space-y-3">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  );
}
