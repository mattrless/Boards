import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthPageSkeleton() {
  return (
    <Card className="w-full animate-pulse">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto h-12 w-12 rounded-xl bg-muted" />
        <div className="mx-auto h-10 w-40 rounded-md bg-muted" />
        <div className="space-y-2">
          <div className="mx-auto h-4 w-72 max-w-full rounded-md bg-muted" />
          <div className="mx-auto h-4 w-64 max-w-full rounded-md bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-10 w-full rounded-md bg-muted" />
        <div className="h-10 w-full rounded-md bg-muted" />
        <div className="h-10 w-full rounded-md bg-muted" />
      </CardContent>
    </Card>
  );
}
