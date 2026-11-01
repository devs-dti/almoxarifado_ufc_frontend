// Calcula cada linha em centavos, arredondando meio centavo para cima.
export function itemTotalCents(quantity: number, price: string): number | null {
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(price)) return null
  const [whole, fraction = ''] = price.replace(',', '.').split('.')
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'))
  const milli = Math.round(quantity * 1000)
  if (!Number.isSafeInteger(cents) || !Number.isSafeInteger(milli) || milli <= 0 || !Number.isSafeInteger(cents * milli)) return null
  return Math.round(cents * milli / 1000)
}
