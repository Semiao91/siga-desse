export const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...init,
  })

  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed with status ${res.status}`, res.status)
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T)
}
