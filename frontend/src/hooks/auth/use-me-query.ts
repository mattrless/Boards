"use client";

import { useQuery } from "@tanstack/react-query";

import { AuthApiError } from "@/lib/api/auth.api";
import { usersControllerFindMe } from "@/lib/api/generated/users/users";
import type { UserResponseDto } from "@/lib/api/generated/boardsAPI.schemas";

export function useMeQuery() {
  return useQuery<UserResponseDto, AuthApiError>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await usersControllerFindMe({
        credentials: "include",
      });
      const status = response.status as number;

      if (status === 200) {
        return response.data as UserResponseDto;
      }

      if (status === 401) {
        throw new AuthApiError("Unauthorized", 401);
      }

      throw new AuthApiError("Unexpected session error", status);
    },
    retry: (failureCount, error) =>
      !(error instanceof AuthApiError && error.status === 401) &&
      failureCount < 1,
  });
}
