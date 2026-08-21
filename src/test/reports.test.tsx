import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import {
  useInventoryReport,
  useLowStockReport,
  useExpiringReport,
  useEntriesSummary,
  useTransfersSummary,
} from '@/features/reports/hooks'
import { InventoryReportDialog } from '@/features/reports/components/InventoryReportDialog'
import { LowStockReportDialog } from '@/features/reports/components/LowStockReportDialog'
import { ExpiringReportDialog } from '@/features/reports/components/ExpiringReportDialog'
import { EntriesSummaryDialog } from '@/features/reports/components/EntriesSummaryDialog'
import { TransfersSummaryDialog } from '@/features/reports/components/TransfersSummaryDialog'
import RelatoriosPage from '@/app/dashboard/relatorios/page'
import { renderWithProviders, createTestQueryClient } from '@/test/render'
import { renderHook } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

describe('Relatórios (Reports) Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createWrapper() {
    const queryClient = createTestQueryClient()
    return {
      queryClient,
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    }
  }

  describe('reportsApi & Hooks', () => {
    it('fetches inventory report', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useInventoryReport(true), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.totalValue).toBe(13490)
      expect(result.current.data?.materials.length).toBeGreaterThan(0)
    })

    it('fetches low stock materials report', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useLowStockReport(true), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.materials).toBeDefined()
      expect(result.current.data?.materials.length).toBeGreaterThan(0)
      expect(result.current.data?.materials[0].minQuantity).toBe(30)
    })

    it('fetches expiring materials report with days parameter', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useExpiringReport(45, true), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.lots).toBeDefined()
      expect(result.current.data?.lots.length).toBeGreaterThan(0)
      expect(result.current.data?.lots[0].lotCode).toBe('LOT-001')
    })

    it('fetches entries summary report', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useEntriesSummary(true), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.totalEntries).toBe(3)
      expect(result.current.data?.totalValue).toBe(15200)
      expect(result.current.data?.bySupplier.length).toBeGreaterThan(0)
      expect(result.current.data?.byGroup.length).toBeGreaterThan(0)
    })

    it('fetches transfers summary report', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useTransfersSummary(true), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.totalTransfers).toBe(5)
      expect(result.current.data?.bySector.length).toBeGreaterThan(0)
    })
  })

  describe('InventoryReportDialog Component', () => {
    it('renders total value, materials list and ABC curve indicators', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<InventoryReportDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Relatório Geral de Materiais' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Papel A4')).toBeInTheDocument()
        expect(screen.getByText('Caneta Azul')).toBeInTheDocument()
        expect(screen.getByText('Detergente 500ml')).toBeInTheDocument()
        expect(screen.getByText('A')).toBeInTheDocument()
        expect(screen.getByText('B')).toBeInTheDocument()
        expect(screen.getByText('C')).toBeInTheDocument()
      })
    })
  })

  describe('LowStockReportDialog Component', () => {
    it('renders materials with deficit below minimum stock', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<LowStockReportDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Materiais em Falta' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Detergente 500ml')).toBeInTheDocument()
        expect(screen.getByText('DET-001')).toBeInTheDocument()
        expect(screen.getByText(/20 \/ 30/i)).toBeInTheDocument()
        expect(screen.getByText(/−10 em falta/i)).toBeInTheDocument()
      })
    })
  })

  describe('ExpiringReportDialog Component', () => {
    it('renders expiration filter and expiring lots list', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      renderWithProviders(<ExpiringReportDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Vencimento de Materiais' })).toBeInTheDocument()
      expect(screen.getByText(/vencendo em até/i)).toBeInTheDocument()

      const daysInput = screen.getByRole('spinbutton')
      expect(daysInput).toHaveValue(30)

      await waitFor(() => {
        expect(screen.getByText('Papel A4')).toBeInTheDocument()
        expect(screen.getByText(/lote LOT-001/i)).toBeInTheDocument()
      })

      // Change days
      await user.clear(daysInput)
      await user.type(daysInput, '60')

      expect(daysInput).toHaveValue(60)
    })
  })

  describe('EntriesSummaryDialog Component', () => {
    it('renders entries count, total financial value, supplier and group breakdowns', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<EntriesSummaryDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Resumo de Entradas' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument()
        expect(screen.getByText('Papelaria Central')).toBeInTheDocument()
        expect(screen.getByText('Papelaria')).toBeInTheDocument()
      })
    })
  })

  describe('TransfersSummaryDialog Component', () => {
    it('renders transfers count and sector breakdown', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<TransfersSummaryDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Resumo de Transferências' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument()
        expect(screen.getByText('TI')).toBeInTheDocument()
        expect(screen.getByText(/50 itens consumidos/i)).toBeInTheDocument()
        expect(screen.getByText('Administrativo')).toBeInTheDocument()
        expect(screen.getByText(/30 itens consumidos/i)).toBeInTheDocument()
      })
    })
  })

  describe('RelatoriosPage', () => {
    it('renders all 5 report options and opens dialogs on click', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RelatoriosPage />)

      expect(screen.getByRole('heading', { name: 'Relatórios' })).toBeInTheDocument()
      expect(screen.getByText('Relatório Geral de Materiais')).toBeInTheDocument()
      expect(screen.getByText('Materiais em Falta')).toBeInTheDocument()
      expect(screen.getByText('Vencimento de Materiais')).toBeInTheDocument()
      expect(screen.getByText('Resumo de Entradas')).toBeInTheDocument()
      expect(screen.getByText('Resumo de Transferências')).toBeInTheDocument()

      // Click "Relatório Geral de Materiais" card
      await user.click(screen.getByText('Relatório Geral de Materiais'))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Relatório Geral de Materiais' })).toBeInTheDocument()
      })
    })
  })
})
