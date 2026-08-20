export const maskCEP = (value: string | undefined) => {
  if (!value) return ''
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)
}

export const maskCNPJ = (value: string | undefined) => {
  if (!value) return ''
  // Remove tudo que não seja alfanumérico (novo CNPJ pode ter letras)
  const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 14)
  // Aplica a máscara: XX.XXX.XXX/XXXX-XX
  return clean
    .replace(/^([A-Z0-9]{2})([A-Z0-9])/, '$1.$2')
    .replace(/^([A-Z0-9]{2}\.[A-Z0-9]{3})([A-Z0-9])/, '$1.$2')
    .replace(/^([A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3})([A-Z0-9])/, '$1/$2')
    .replace(/^([A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4})([A-Z0-9])/, '$1-$2')
}

export const maskPhone = (value: string | undefined) => {
  if (!value) return ''
  const v = value.replace(/\D/g, '')
  if (v.length <= 10) {
    return v
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14)
  }
  return v
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}
