export default function ProtectedLayoutSkeleton() {
  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-4xl animate-pulse space-y-4">
        <div className="h-8 w-56 rounded-md bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-28 rounded-lg bg-muted" />
          <div className="h-28 rounded-lg bg-muted" />
          <div className="h-28 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
