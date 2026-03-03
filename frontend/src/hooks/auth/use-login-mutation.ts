"use client";

import { useMutation } from "@tanstack/react-query";

import { login } from "@/lib/api/auth.api";
import type { LoginSchema } from "@/lib/schemas/auth/login.schema";

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: (data: LoginSchema) => login(data),
  });
}
