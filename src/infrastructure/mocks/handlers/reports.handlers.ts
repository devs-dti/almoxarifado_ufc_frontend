import { http, HttpResponse } from 'msw'
import { mockId } from '../utils'

export const reportsHandlers = [
  http.get('/reports/materials/inventory', () =>
    HttpResponse.json({
      materials: [
        { materialId: mockId(41), materialName: 'Papel A4', code: 'PAP-001', quantity: 500, totalValue: 12950, abcCurve: 'A' },
        { materialId: mockId(42), materialName: 'Caneta Azul', code: 'CAN-001', quantity: 80, totalValue: 240, abcCurve: 'C' },
        { materialId: mockId(43), materialName: 'Detergente 500ml', code: 'DET-001', quantity: 20, totalValue: 300, abcCurve: 'B' },
      ],
      totalValue: 13490,
      generatedAt: new Date().toISOString(),
    })
  ),

  http.get('/reports/materials/low-stock', () =>
    HttpResponse.json({
      materials: [
        { materialId: mockId(43), materialName: 'Detergente 500ml', code: 'DET-001', quantity: 20, minQuantity: 30 },
      ],
    })
  ),

  http.get('/reports/materials/expiring', ({ request }) => {
    const url = new URL(request.url)
    const days = url.searchParams.get('days') ?? '30'
    return HttpResponse.json({
      lots: [
        { lotId: mockId(71), lotCode: 'LOT-001', materialId: mockId(41), materialName: 'Papel A4', quantity: 100, expiresAt: '2025-07-15', daysUntilExpiry: Number(days) - 5 },
      ],
    })
  }),

  http.get('/reports/entries/summary', () =>
    HttpResponse.json({
      totalEntries: 3,
      totalValue: 15200,
      bySupplier: [
        { supplierId: mockId(1), supplierName: 'Papelaria Central', totalValue: 12950 },
      ],
      byGroup: [
        { groupId: mockId(21), groupName: 'Papelaria', totalValue: 12950 },
      ],
    })
  ),

  http.get('/reports/transfers/summary', () =>
    HttpResponse.json({
      totalTransfers: 5,
      bySector: [
        { sectorId: mockId(1), sectorName: 'TI', itemsConsumed: 50, totalCost: 1295 },
        { sectorId: mockId(2), sectorName: 'Administrativo', itemsConsumed: 30, totalCost: 450 },
      ],
    })
  ),
]
