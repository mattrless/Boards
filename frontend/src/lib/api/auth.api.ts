import type {
  LoginResponseDto,
  LoginUserDto,
} from "@/lib/api/generated/boardsAPI.schemas";

export class AuthApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

export async function login(data: LoginUserDto): Promise<LoginResponseDto> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const status = response.status;

  if (status === 200) return (await response.json()) as LoginResponseDto;
  if (response.status === 401)
    throw new AuthApiError("Invalid credentials", 401);
  if (response.status === 400)
    throw new AuthApiError("Invalid request data", 400);

  throw new AuthApiError("Unexpected login error", status);
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new AuthApiError("Unexpected logout error", response.status);
  }
}
