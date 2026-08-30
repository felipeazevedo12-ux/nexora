const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = "Erro na requisição";

    try {
      const data = await response.json();

      if (typeof data?.message === "string") {
        message = data.message;
      }
    } catch {
      // Resposta sem JSON
    }

    throw new Error(message);
  }

  return response.json();
}