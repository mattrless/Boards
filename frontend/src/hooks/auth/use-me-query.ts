"use client";

import { useQuery } from "@tanstack/react-query";

import { AuthApiError, getCurrentUser } from "@/lib/api/auth.api";

export function useMeQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: (failureCount, error) =>
      !(error instanceof AuthApiError && error.status === 401) &&
      failureCount < 1,
  });
}
