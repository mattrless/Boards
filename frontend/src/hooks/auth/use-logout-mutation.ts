"use client";

import { useMutation } from "@tanstack/react-query";

import { logout } from "@/lib/api/auth.api";

export function useLogoutMutation() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
  });
}
