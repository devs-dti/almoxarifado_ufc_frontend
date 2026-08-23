import { sanitizeApiErrorMessage } from './sanitizeApiError'

export function parseApiError(err: unknown, fallback = 'Erro inesperado. Tente novamente.'): string {
  const message = sanitizeApiErrorMessage(err)
  return message && message !== 'Erro desconhecido ao processar requisição.' ? message : fallback
}
