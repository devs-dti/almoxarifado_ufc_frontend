import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'

import { useAuthStore } from '@/store/useAuthStore'
import { transfersApi } from '@/features/transfers/api'
import {
  useTransfers,
  useCreateTransfer,
  useApproveTransfer,
  useDisapproveTransfer,
} from '@/features/transfers/hooks'
import { TransferList } from '@/features/transfers/components/TransferList'
import { CreateTransferDialog } from '@/features/transfers/components/CreateTransferDialog'
import { ApproveTransferDialog } from '@/features/transfers/components/ApproveTransferDialog'
import { TransferAccordion } from '@/features/transfers/components/TransferAccordion'
import type { Transfer } from '@/features/transfers/types'
import { renderWithProviders, createTestQueryClient } from '@/test/render'
import { renderHook } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

describe('Transferências (Transfers) Flow', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', name: 'Gestor Teste', email: 'gestor@ufc.br', role: 'MANAGER' },
      loading: false,
    })
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

  describe('transfersApi & Hooks', () => {
    it('lists transfers with pagination', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useTransfers({ page: 0, size: 10 }), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.content).toBeDefined()
      expect(result.current.data?.content.length).toBeGreaterThanOrEqual(1)
      expect(result.current.data?.totalElements).toBeGreaterThanOrEqual(1)
    })

    it('fetches a single transfer by ID', async () => {
      const list = await transfersApi.list()
      const firstId = list.content[0].id

      const transfer = await transfersApi.get(firstId)
      expect(transfer.id).toBe(firstId)
      expect(transfer.sector).toBeDefined()
    })

    it('creates a new transfer via useCreateTransfer', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useCreateTransfer(), { wrapper })

      const newTransfer = await result.current.mutateAsync({
        exitType: 'SECTOR',
        notes: 'Transferência de teste',
        items: [{ materialId: 'mat-1', requestedQuantity: 15 }],
      })

      expect(newTransfer.id).toBeDefined()
      expect(newTransfer.status).toBe('PENDING')
      expect(newTransfer.items.length).toBe(1)
    })

    it('approves a transfer via useApproveTransfer', async () => {
      const list = await transfersApi.list()
      const transferId = list.content[0].id
      const itemId = list.content[0].items[0]?.id || 'item-1'

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useApproveTransfer(), { wrapper })

      const approved = await result.current.mutateAsync({
        id: transferId,
        data: {
          items: [{ transferItemId: itemId, approvedQuantity: 8 }],
        },
      })

      expect(approved.status).toBe('FINISHED')
    })

    it('disapproves a transfer via useDisapproveTransfer', async () => {
      const created = await transfersApi.create({
        exitType: 'SECTOR',
        notes: 'Teste',
        items: [{ materialId: 'mat-1', requestedQuantity: 5 }],
      })

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useDisapproveTransfer(), { wrapper })

      await expect(result.current.mutateAsync(created.id)).resolves.toBeDefined()
    })
  })

  describe('TransferList Component', () => {
    it('renders the header and "Nova" button for MANAGER role', async () => {
      renderWithProviders(<TransferList />)

      expect(screen.getByRole('heading', { name: 'Transferências' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /nova/i })).toBeInTheDocument()

      await waitFor(() => {
        const transfers = screen.getAllByText('Transferência')
        expect(transfers.length).toBeGreaterThan(0)
      })
    })

    it('hides "Nova" button for users without permission', () => {
      useAuthStore.setState({
        user: null,
      })

      renderWithProviders(<TransferList />)

      expect(screen.queryByRole('button', { name: /nova/i })).not.toBeInTheDocument()
    })

    it('opens CreateTransferDialog when clicking "Nova"', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TransferList />)

      const newBtn = screen.getByRole('button', { name: /nova/i })
      await user.click(newBtn)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Nova Transferência' })).toBeInTheDocument()
      })
    })
  })

  describe('CreateTransferDialog Component', () => {
    it('closes dialog when clicking Cancelar', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(<CreateTransferDialog open={true} onOpenChange={onOpenChange} />)

      await user.click(screen.getByRole('button', { name: 'Cancelar' }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('ApproveTransferDialog Component', () => {
    it('renders requested items and submits approved quantities', async () => {
      const created = await transfersApi.create({
        exitType: 'SECTOR',
        notes: 'Aprovação teste',
        items: [{ materialId: 'mat-1', requestedQuantity: 20 }],
      })

      const onOpenChange = vi.fn()

      renderWithProviders(
        <ApproveTransferDialog transfer={created} onOpenChange={onOpenChange} />
      )

      expect(screen.getByRole('heading', { name: 'Aprovar Transferência' })).toBeInTheDocument()
      expect(screen.getByText(/Solicitado: 20/i)).toBeInTheDocument()

      const approvedInput = screen.getByLabelText(/qtd\. aprovada/i)
      expect(approvedInput).toBeInTheDocument()
    })
  })

  describe('TransferAccordion Component', () => {
    const mockPendingTransfer: Transfer = {
      id: 'trans-accordion-1',
      sector: 'Almoxarifado Geral',
      requester: 'Mariana Lima',
      status: 'PENDING',
      exitType: 'SECTOR',
      createdAt: '2025-09-26T09:00:00Z',
      items: [
        {
          id: 'item-1',
          name: 'Papel A4',
          quantity: 10,
          measurementUnit: 'UN',
        },
      ],
    }

    it('expands to show item details and action buttons for MANAGER role', async () => {
      const user = userEvent.setup()

      renderWithProviders(<TransferAccordion transfer={mockPendingTransfer} />)

      expect(screen.getByText('Transferência')).toBeInTheDocument()
      expect(screen.getByText('Almoxarifado Geral')).toBeInTheDocument()
      expect(screen.getByText('Mariana Lima')).toBeInTheDocument()
      expect(screen.getByText('Pendente')).toBeInTheDocument()

      // Expand
      const expandBtn = screen.getByRole('button', { name: /transferência/i })
      await user.click(expandBtn)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /aprovar/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /reprovar/i })).toBeInTheDocument()
      })
    })

    it('denies a pending transfer when clicking Reprovar', async () => {
      const created = await transfersApi.create({
        exitType: 'SECTOR',
        notes: 'Teste',
        items: [{ materialId: 'mat-1', requestedQuantity: 5 }],
      })
      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(<TransferAccordion transfer={created} />)

      const expandBtn = screen.getByRole('button', { name: /transferência/i })
      await user.click(expandBtn)
      const denyBtn = await screen.findByRole('button', { name: /reprovar/i })
      await user.click(denyBtn)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Transferência reprovada.')
      })
    })
  })
})
