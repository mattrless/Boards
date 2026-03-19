export default function BoardPageSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-max items-start gap-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, index) => (
          <section
            key={index}
            className="w-80 space-y-3 rounded-xl border bg-card p-3"
          >
            <div className="h-6 w-40 rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-muted" />
              <div className="h-20 rounded-lg bg-muted" />
              <div className="h-20 rounded-lg bg-muted" />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
