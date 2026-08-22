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
      const { result } = renderHook(() => useInventoryReport(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.content.length).toBeGreaterThan(0)
      expect(result.current.data?.content[0].materialName).toBe('Papel A4')
    })

    it('fetches low stock materials report', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useLowStockReport(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.content).toBeDefined()
      expect(result.current.data?.content.length).toBeGreaterThan(0)
      expect(result.current.data?.content[0].quantity).toBe(20)
    })

    it('fetches expiring materials report with maxExpirationDate parameter', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useExpiringReport({ maxExpirationDate: '2025-12-31' }), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.content).toBeDefined()
      expect(result.current.data?.content.length).toBeGreaterThan(0)
      expect(result.current.data?.content[0].lotCode).toBe('LOT-001')
    })

    it('fetches entries summary report', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useEntriesSummary(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.content.length).toBeGreaterThan(0)
      expect(result.current.data?.content[0].materialName).toBe('Papel A4')
    })

    it('fetches transfers summary report', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useTransfersSummary(), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.content.length).toBeGreaterThan(0)
      expect(result.current.data?.content[0].materialName).toBe('Papel A4')
    })
  })

  describe('InventoryReportDialog Component', () => {
    it('renders materials list and pagination elements', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<InventoryReportDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Relação Geral de Itens em Estoque' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Papel A4')).toBeInTheDocument()
        expect(screen.getByText('Caneta Azul')).toBeInTheDocument()
        expect(screen.getByText('Detergente 500ml')).toBeInTheDocument()
      })
    })
  })

  describe('LowStockReportDialog Component', () => {
    it('renders materials with low stock', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<LowStockReportDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Materiais com Estoque Zerado ou Baixo' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Detergente 500ml')).toBeInTheDocument()
      })
    })
  })

  describe('ExpiringReportDialog Component', () => {
    it('renders expiring materials list', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<ExpiringReportDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Controle de Vencimentos por Lote' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Papel A4')).toBeInTheDocument()
        expect(screen.getByText('LOT-001')).toBeInTheDocument()
      })
    })
  })

  describe('EntriesSummaryDialog Component', () => {
    it('renders entries records', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<EntriesSummaryDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Histórico e Registro de Entradas' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Papel A4')).toBeInTheDocument()
      })
    })
  })

  describe('TransfersSummaryDialog Component', () => {
    it('renders transfers summary', async () => {
      const onOpenChange = vi.fn()
      renderWithProviders(<TransfersSummaryDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Histórico e Registro de Saídas / Transferências' })).toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByText('Papel A4')).toBeInTheDocument()
        expect(screen.getByText('Caneta Azul')).toBeInTheDocument()
      })
    })
  })

  describe('RelatoriosPage', () => {
    it('renders all 5 report options and opens dialogs on click', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RelatoriosPage />)

      expect(screen.getByRole('heading', { name: 'Relatórios & Registros' })).toBeInTheDocument()
      expect(screen.getByText('Relação Geral de Itens em Estoque')).toBeInTheDocument()
      expect(screen.getByText('Materiais com Estoque Zerado ou Baixo')).toBeInTheDocument()
      expect(screen.getByText('Controle de Vencimentos por Lote')).toBeInTheDocument()
      expect(screen.getByText('Histórico e Registro de Entradas')).toBeInTheDocument()
      expect(screen.getByText('Histórico e Registro de Transferências / Saídas')).toBeInTheDocument()

      // Click "Relação Geral de Itens em Estoque" card
      await user.click(screen.getByText('Relação Geral de Itens em Estoque'))

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Relação Geral de Itens em Estoque' })).toBeInTheDocument()
      })
    })
  })
})
