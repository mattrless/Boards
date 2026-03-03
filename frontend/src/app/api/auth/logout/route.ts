import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_TOKEN_COOKIE_NAME } from "@/lib/server/nest-api";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);

  return NextResponse.json({ message: "Logged out successfully" });
}
