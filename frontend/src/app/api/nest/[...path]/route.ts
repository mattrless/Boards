import { NextResponse } from "next/server";

import { getApiBaseUrl, getBearerAuthHeader } from "@/lib/server/nest-api";

async function forwardToNest(
  request: Request,
  path: string[],
): Promise<Response> {
  const apiBaseUrl = getApiBaseUrl();
  const pathname = path.join("/");
  const url = new URL(request.url);
  const targetUrl = `${apiBaseUrl}/${pathname}${url.search}`;

  const headers = new Headers(request.headers);
  const authHeader = await getBearerAuthHeader();

  if (authHeader.Authorization) {
    headers.set("Authorization", authHeader.Authorization);
  }

  headers.delete("cookie");
  headers.delete("host");

  const hasBody = !["GET", "HEAD"].includes(request.method.toUpperCase());
  const body = hasBody ? await request.text() : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");
  responseHeaders.delete("transfer-encoding");

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardToNest(request, path);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardToNest(request, path);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardToNest(request, path);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardToNest(request, path);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardToNest(request, path);
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
