"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { useMeQuery } from "@/hooks/auth/use-me-query";
import { useLogoutMutation } from "@/hooks/auth/use-logout-mutation";
import { AuthApiError } from "@/lib/api/auth.api";

export default function BoardsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    if (meQuery.error instanceof AuthApiError && meQuery.error.status === 401) {
      router.replace("/");
    }
  }, [meQuery.error, router]);

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["auth", "me"] });
        router.replace("/");
      },
    });
  }

  if (meQuery.isPending) {
    return <p className="p-6">Checking session...</p>;
  }

  if (meQuery.isError) {
    if (meQuery.error instanceof AuthApiError && meQuery.error.status === 401) {
      return null;
    }

    return <p className="p-6">Could not load your session.</p>;
  }

  const user = meQuery.data;

  return (
    <main className="p-6">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Boards</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {user.profile.name} ({user.email})
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </main>
  );
}
