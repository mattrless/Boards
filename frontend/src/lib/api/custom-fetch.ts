export async function customFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const basePath = "/api/nest";
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  const targetUrl = `${basePath}${normalizedPath}`;

  const response = await fetch(targetUrl, {
    ...options,
    credentials: options?.credentials ?? "include",
  });

  const bodyText = [204, 205, 304].includes(response.status)
    ? null
    : await response.text();

  let data: unknown = {};
  if (bodyText) {
    try {
      data = JSON.parse(bodyText);
    } catch {
      data = bodyText;
    }
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
}
