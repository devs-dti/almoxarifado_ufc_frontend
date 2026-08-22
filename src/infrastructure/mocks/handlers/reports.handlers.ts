import { http, HttpResponse } from 'msw'

const paged = <T>(content: T[]) => ({
  content,
  totalElements: content.length,
  totalPages: Math.ceil(content.length / 10) || 1,
  size: 10,
  number: 0,
})

const inventoryData = [
  { materialName: 'Papel A4', lotCode: 'LOT-001', currentLotQuantity: 500, measurementUnitDescription: 'Pacote', invoiceNumber: 'NF-1001', expirationDate: '2026-12-31' },
  { materialName: 'Caneta Azul', lotCode: 'LOT-002', currentLotQuantity: 80, measurementUnitDescription: 'Unidade', invoiceNumber: 'NF-1002', expirationDate: '2026-12-31' },
  { materialName: 'Detergente 500ml', lotCode: 'LOT-003', currentLotQuantity: 20, measurementUnitDescription: 'Litro', invoiceNumber: 'NF-1003', expirationDate: '2026-12-31' },
]

const lowStockData = [
  { materialName: 'Detergente 500ml', measurementUnit: 'Litro', quantity: 20 },
]

const expiringData = [
  { materialName: 'Papel A4', lotCode: 'LOT-001', quantity: 100, expirationDate: '2025-07-15', measurementUnit: 'Pacote' },
]

const entriesSummaryData = [
  { materialName: 'Papel A4', quantity: 500, entryDate: '2025-06-01', measurementUnit: 'Pacote' },
]

const transfersSummaryData = [
  { materialName: 'Papel A4', quantity: 50, exitDate: '2025-06-10', measurementUnit: 'Pacote', currentStock: 450 },
  { materialName: 'Caneta Azul', quantity: 30, exitDate: '2025-06-11', measurementUnit: 'Unidade', currentStock: 50 },
]

export const reportsHandlers = [
  http.get('/reports/materials/inventory', () => HttpResponse.json(paged(inventoryData))),
  http.get('/reports/materials', () => HttpResponse.json(paged(inventoryData))),

  http.get('/reports/materials/low-stock', () => HttpResponse.json(paged(lowStockData))),

  http.get('/reports/materials/expiring', () => HttpResponse.json(paged(expiringData))),

  http.get('/reports/entries/summary', () => HttpResponse.json(paged(entriesSummaryData))),

  http.get('/reports/transfers/summary', () => HttpResponse.json(paged(transfersSummaryData))),
  http.get('/reports/transfer/summary', () => HttpResponse.json(paged(transfersSummaryData))),
]
