import { httpClient } from '@/infrastructure/http/client'

/**
 * Utilitário genérico para forçar o download de arquivos binários com suporte a parâmetros de filtro.
 */
export async function downloadFile(url: string, filename: string, params?: Record<string, unknown>) {
  const response = await httpClient.get(url, { responseType: 'blob', params })
  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'application/octet-stream',
  })
  
  const objectUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  
  // Limpeza
  link.parentNode?.removeChild(link)
  window.URL.revokeObjectURL(objectUrl)
}
