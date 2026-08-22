export function buildFormData(data: Record<string, unknown>): FormData {
  const fd = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      fd.append(key, value instanceof File ? value : String(value))
    }
  })
  return fd
}
