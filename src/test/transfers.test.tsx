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
import type { Role } from '@/features/auth/types'
import { renderWithProviders, createTestQueryClient } from '@/test/render'
import { renderHook } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

describe('Transferências (Transfers) Flow', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: 'mock-jwt-access-token',
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
      expect(transfer.sectorName).toBeDefined()
    })

    it('creates a new transfer via useCreateTransfer', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useCreateTransfer(), { wrapper })

      const newTransfer = await result.current.mutateAsync({
        sectorId: 'sector-1',
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

      expect(approved.status).toBe('APPROVED')
    })

    it('disapproves a transfer via useDisapproveTransfer', async () => {
      const created = await transfersApi.create({
        sectorId: 'sector-1',
        items: [{ materialId: 'mat-1', requestedQuantity: 5 }],
      })

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useDisapproveTransfer(), { wrapper })

      await expect(result.current.mutateAsync({ id: created.id })).resolves.toBeDefined()
    })
  })

  describe('TransferList Component', () => {
    it('renders the header and "Nova" button for MANAGER role', async () => {
      renderWithProviders(<TransferList />)

      expect(screen.getByRole('heading', { name: 'Transferências' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /nova/i })).toBeInTheDocument()

      await waitFor(() => {
        const transfers = screen.getAllByText(/transferência #/i)
        expect(transfers.length).toBeGreaterThan(0)
      })
    })

    it('hides "Nova" button for users without permission', () => {
      useAuthStore.setState({
        token: 'token',
        user: { id: '2', name: 'Sem Permissao', email: 'guest@ufc.br', role: 'USER' as Role },
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
    it('renders dialog elements, allows adding item rows, and handles validation', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(<CreateTransferDialog open={true} onOpenChange={onOpenChange} />)

      expect(screen.getByRole('heading', { name: 'Nova Transferência' })).toBeInTheDocument()
      expect(screen.getByText('Setor')).toBeInTheDocument()
      expect(screen.getByText('Itens')).toBeInTheDocument()

      // Click "Adicionar item" button
      const addItemBtn = screen.getByRole('button', { name: /adicionar item/i })
      await user.click(addItemBtn)

      // Submitting without choosing sector triggers validation error
      const submitBtn = screen.getByRole('button', { name: 'Solicitar' })
      await user.click(submitBtn)

      await waitFor(() => {
        expect(screen.getByText('Selecione um setor')).toBeInTheDocument()
      })
    })

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
        sectorId: 'sec-1',
        items: [{ materialId: 'mat-1', requestedQuantity: 20 }],
      })

      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(
        <ApproveTransferDialog transfer={created} onOpenChange={onOpenChange} />
      )

      expect(screen.getByRole('heading', { name: new RegExp(`Aprovar Transferência #${created.id}`, 'i') })).toBeInTheDocument()
      expect(screen.getByText(/Solicitado: 20/i)).toBeInTheDocument()

      const approvedInput = screen.getByLabelText(/qtd\. aprovada/i)
      expect(approvedInput).toBeInTheDocument()

      const approveBtn = screen.getByRole('button', { name: 'Aprovar' })
      await user.click(approveBtn)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Transferência aprovada!')
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('TransferAccordion Component', () => {
    const mockPendingTransfer: Transfer = {
      id: 'trans-accordion-1',
      sectorId: 'sec-1',
      sectorName: 'Almoxarifado Geral',
      requestedBy: 'Mariana Lima',
      status: 'PENDING',
      createdAt: '2025-09-26T09:00:00Z',
      items: [
        {
          id: 'item-1',
          materialId: 'mat-1',
          materialName: 'Papel A4',
          requestedQuantity: 10,
        },
      ],
    }

    it('expands to show item details and action buttons for MANAGER role', async () => {
      const user = userEvent.setup()

      renderWithProviders(<TransferAccordion transfer={mockPendingTransfer} />)

      expect(screen.getByText('Transferência #trans-accordion-1')).toBeInTheDocument()
      expect(screen.getByText('Almoxarifado Geral')).toBeInTheDocument()
      expect(screen.getByText('Mariana Lima')).toBeInTheDocument()
      expect(screen.getByText('Pendente')).toBeInTheDocument()

      // Expand
      await user.click(screen.getByText('Transferência #trans-accordion-1'))

      await waitFor(() => {
        expect(screen.getByText('Papel A4')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /aprovar/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /negar/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
      })
    })

    it('denies a pending transfer when clicking Negar', async () => {
      const created = await transfersApi.create({
        sectorId: 'sec-1',
        items: [{ materialId: 'mat-1', requestedQuantity: 5 }],
      })
      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(<TransferAccordion transfer={created} />)

      await user.click(screen.getByText(new RegExp(`Transferência #${created.id}`, 'i')))
      const denyBtn = await screen.findByRole('button', { name: /negar/i })
      await user.click(denyBtn)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Transferência negada.')
      })
    })

    it('cancels a pending transfer when clicking Cancelar', async () => {
      const created = await transfersApi.create({
        sectorId: 'sec-1',
        items: [{ materialId: 'mat-1', requestedQuantity: 5 }],
      })
      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(<TransferAccordion transfer={created} />)

      await user.click(screen.getByText(new RegExp(`Transferência #${created.id}`, 'i')))
      const cancelBtn = await screen.findByRole('button', { name: /cancelar/i })
      await user.click(cancelBtn)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Transferência cancelada.')
      })
    })

    it('opens ApproveTransferDialog when clicking Aprovar', async () => {
      const user = userEvent.setup()

      renderWithProviders(<TransferAccordion transfer={mockPendingTransfer} />)

      await user.click(screen.getByText('Transferência #trans-accordion-1'))
      const approveBtn = await screen.findByRole('button', { name: /aprovar/i })
      await user.click(approveBtn)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: /aprovar transferência #trans-accordion-1/i })).toBeInTheDocument()
      })
    })
  })
})
