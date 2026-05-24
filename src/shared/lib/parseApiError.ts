import axios from 'axios'

export function parseApiError(err: unknown, fallback = 'Erro inesperado. Tente novamente.'): string {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as { message?: string } | undefined
    return body?.message ?? err.message ?? fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}
