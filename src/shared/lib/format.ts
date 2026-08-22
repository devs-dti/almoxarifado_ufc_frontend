export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '-'
    const datePart = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const timePart = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    return `${datePart} às ${timePart}`
  } catch {
    return '-'
  }
}

export function formatLongDate(iso?: string | null): string {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return '-'
  }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatCPF(value: string): string {
  const v = value.replace(/\D/g, '')
  return v
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
