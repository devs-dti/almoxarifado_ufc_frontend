import { toast } from 'sonner'
import { httpClient } from '@/infrastructure/http/client'

/**
 * Utilitário genérico para forçar o download de arquivos binários com suporte a parâmetros de filtro.
 */
export async function downloadFile(url: string, filename: string, params?: Record<string, unknown>) {
  try {
    const response = await httpClient.get(url, { responseType: 'blob', params })
    
    // Se o backend retornou JSON com mensagem de erro encapsulado no blob
    if (response.data?.type?.includes('application/json')) {
      const text = await response.data.text()
      try {
        const json = JSON.parse(text)
        toast.error(json.message || 'Erro ao gerar arquivo para download.')
        return
      } catch {
        // Se não for JSON válido, segue o fluxo normal
      }
    }

    const contentType = response.headers['content-type'] || 'application/octet-stream'
    const blob = new Blob([response.data], { type: contentType })
    
    const objectUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    
    // Limpeza
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(objectUrl)
    toast.success('Download iniciado com sucesso!')
  } catch (error: any) {
    // Se o erro do Axios contiver um Blob com JSON
    if (error.response?.data instanceof Blob && error.response.data.type?.includes('application/json')) {
      try {
        const text = await error.response.data.text()
        const json = JSON.parse(text)
        toast.error(json.message || 'Erro ao baixar o relatório.')
        return
      } catch {
        // Ignora falha de parse
      }
    }
    console.error('Erro no download:', error)
    toast.error('Não foi possível baixar o relatório. Verifique os dados e tente novamente.')
  }
}
