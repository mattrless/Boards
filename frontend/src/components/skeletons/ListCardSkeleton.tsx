import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function ListCardSkeleton() {
  return (
    <Card className="w-72 shrink-0 self-start overflow-hidden gap-0 pt-4 pb-2 max-h-[calc(100dvh-9rem)] animate-pulse">
      <CardHeader className="px-4">
        <div className="h-6 w-32 rounded-md bg-muted" />
      </CardHeader>
      <CardContent className="scrollbar-hidden px-4 flex min-h-0 flex-col gap-2 overflow-y-auto">
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
        <div className="h-20 rounded-lg bg-muted" />
      </CardContent>
      <CardFooter className="pt-2 px-4">
        <div className="h-9 w-full rounded-md bg-muted" />
      </CardFooter>
    </Card>
  );
}
