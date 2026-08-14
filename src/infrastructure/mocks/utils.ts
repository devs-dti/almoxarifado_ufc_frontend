export function mockId(value: number): string {
  return `00000000-0000-4000-8000-${String(value).padStart(12, '0').slice(-12)}`
}
