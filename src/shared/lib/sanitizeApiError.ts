/**
 * Mapeador e sanitizador de erros de API.
 * Traduz mensagens técnicas e oculta identificadores internos (UUIDs)
 * para proporcionar uma experiência limpa e amigável ao usuário.
 */
export function sanitizeApiErrorMessage(error: any): string {
  if (!error) return 'Erro desconhecido ao processar requisição.'

  // Se for erro de conexão/rede sem resposta do servidor
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.'
  }

  const status = error.response?.status
  const data = error.response?.data
  const rawMessage: string = data?.message || error.message || ''

  // 1. Extrai mensagens de validação por campo do Spring Boot (errors: [{ field, message }])
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const fieldErrors = data.errors
      .map((e: { field?: string; message?: string }) => {
        const msg = e.message || ''
        if (/must be greater than zero/i.test(msg)) return 'Quantidade deve ser maior que zero'
        if (/must not be (null|blank|empty)/i.test(msg)) return 'Preencha todos os campos obrigatórios'
        if (/already (exists|registered)/i.test(msg)) return 'Este registro já está cadastrado'
        return msg
      })
      .filter(Boolean)

    if (fieldErrors.length > 0) {
      return fieldErrors.join(' • ')
    }
  }

  // 2. Erros 404 (Não Encontrado / ID inexistente ou já excluído)
  if (status === 404 || /not found/i.test(rawMessage)) {
    return 'O registro selecionado não foi encontrado ou já foi removido.'
  }

  // 3. Erros 409 (Conflito / Duplicidade)
  if (status === 409 || /already exists|duplicate key/i.test(rawMessage)) {
    return 'Já existe um registro com estas informações cadastrado no sistema.'
  }

  // 4. Integridade referencial / Dados em uso
  if (/foreign key|constraint|in use|possui (movimenta|vinc)/i.test(rawMessage)) {
    return 'Este registro não pode ser excluído pois possui movimentações ou dados vinculados.'
  }

  // 5. Erros 403 (Permissão)
  if (status === 403) {
    return 'Você não tem permissão para realizar esta operação.'
  }

  // 6. Erros 500+ (Falha de Servidor)
  if (status && status >= 500) {
    return 'Ocorreu um erro no servidor. Tente novamente mais tarde.'
  }

  // 7. Se a mensagem já for amigável (em português), remove apenas UUIDs técnicos se houver
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
  const cleaned = rawMessage.replace(uuidRegex, '').replace(/\s{2,}/g, ' ').trim()

  return cleaned || 'Erro ao processar a operação. Tente novamente.'
}
