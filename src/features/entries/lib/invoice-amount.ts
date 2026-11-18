// Aceita moeda brasileira e decimais simples com ponto, sem arredondar entradas inválidas.
export function parseInvoiceAmount(value: string | number): number | null {
  let whole: string
  let fraction: string

  if (typeof value === 'number') {
    const decimal = String(value)
    if (!/^\d+(?:\.\d{1,2})?$/.test(decimal)) return null
    const parts = decimal.split('.')
    whole = parts[0]
    fraction = parts[1] ?? ''
  } else {
    const text = value.trim().replace(/^R\$\s*/, '')
    if (/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(text)) {
      const [integer, decimals = ''] = text.split(',')
      whole = integer.replace(/\./g, '')
      fraction = decimals
    } else if (/^\d+\.\d{1,2}$/.test(text)) {
      const parts = text.split('.')
      whole = parts[0]
      fraction = parts[1] ?? ''
    } else {
      return null
    }
  }

  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  return Number.isSafeInteger(cents) ? cents / 100 : null
}

export function formatInvoiceAmount(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
