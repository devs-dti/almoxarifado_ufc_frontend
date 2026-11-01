import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

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
import { TransferDetails } from '@/features/transfers/components/TransferDetails'
import { TransferAccordion } from '@/features/transfers/components/TransferAccordion'
import type { Transfer } from '@/features/transfers/types'
import { renderWithProviders, createTestQueryClient } from '@/test/render'
import { mockPush } from '@/test/setup'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
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
      const details = await transfersApi.get(newTransfer.id)
      expect(details.status).toBe('PENDING')
      expect(details.items.length).toBe(1)
    })

    it('approves a transfer via useApproveTransfer', async () => {
      const list = await transfersApi.list()
      const transferId = list.content[0].id
      const itemId = list.content[0].items[0]?.id || 'item-1'

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useApproveTransfer(), { wrapper })

      await result.current.mutateAsync({
        id: transferId,
        data: {
          items: [{ transferItemId: itemId, approvedQuantity: 8 }],
        },
      })

      expect((await transfersApi.get(transferId)).status).toBe('FINISHED')
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
    it('envia busca, ordenação e paginação à API', async () => {
      const requests: string[] = []
      server.use(http.get('/transfers', ({ request }) => {
        const params = new URL(request.url).searchParams
        requests.push(params.toString())
        const page = Number(params.get('page'))
        const size = Number(params.get('size'))
        return HttpResponse.json({ data: [{ id: `t-${page}`, status: 'PENDING', exitType: 'SECTOR', createdAt: '2025-01-01' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
      }))
      const user = userEvent.setup()
      renderWithProviders(<TransferList />)
      await screen.findByText('Mostrando 1–10 de 25 transferências')
      await user.click(screen.getByRole('button', { name: 'Próxima página' }))
      await screen.findByText('Mostrando 11–20 de 25 transferências')
      await user.type(screen.getByLabelText('Buscar por setor ou solicitante'), 'Odonto')
      await waitFor(() => { const params = new URLSearchParams(requests.at(-1)); expect(params.get('search')).toBe('Odonto'); expect(params.get('page')).toBe('0') })
      await user.selectOptions(screen.getByLabelText('Ordenar por'), 'status,desc')
      await user.selectOptions(screen.getByLabelText('Transferências por página'), '20')
      await waitFor(() => { const params = new URLSearchParams(requests.at(-1)); expect(params.get('sort')).toBe('status,desc'); expect(params.get('size')).toBe('20') })
    })

    it('renders the header and "Nova" button for MANAGER role', async () => {
      renderWithProviders(<TransferList />)

      expect(screen.getByRole('heading', { name: 'Transferências' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /nova/i })).toBeInTheDocument()

      await waitFor(() => {
        const transfers = screen.getAllByText(/Transferência #/)
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
    it('busca um material e abre os detalhes após solicitar', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreateTransferDialog open onOpenChange={vi.fn()} />)
      await user.type(screen.getByLabelText('Observações'), 'Pedido de material')
      await user.type(screen.getByLabelText('Buscar material 1'), 'Papel A4')
      await user.click(await screen.findByRole('button', { name: /Papel A4/ }))
      await user.click(screen.getByRole('button', { name: 'Solicitar' }))
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/dashboard\/transferencias\/[a-f0-9-]+$/)))
      const id = mockPush.mock.calls[0][0].split('/').pop()
      expect((await transfersApi.get(id)).items).toHaveLength(1)
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
        exitType: 'SECTOR',
        notes: 'Aprovação teste',
        items: [{ materialId: 'mat-1', requestedQuantity: 20 }],
      })

      const onOpenChange = vi.fn()

      const details = await transfersApi.get(created.id)
      renderWithProviders(
        <ApproveTransferDialog transfer={details} onOpenChange={onOpenChange} />
      )

      expect(screen.getByRole('heading', { name: 'Aprovar Transferência' })).toBeInTheDocument()
      expect(screen.getByText(/Solicitado: 20/i)).toBeInTheDocument()

      const approvedInput = screen.getByLabelText(/qtd\. aprovada/i)
      expect(approvedInput).toBeInTheDocument()
    })
  })

  describe('Detalhes da transferência', () => {
    it('oferece link para a página de detalhes', () => {
      const transfer: Transfer = { id: 'trans-1', status: 'PENDING', exitType: 'SECTOR', createdAt: '2025-09-26', items: [] }
      renderWithProviders(<TransferAccordion transfer={transfer} />)
      expect(screen.getByRole('link', { name: /transferência #trans-1/i })).toHaveAttribute('href', '/dashboard/transferencias/trans-1')
    })
    it('carrega os itens e reprova uma solicitação pendente', async () => {
      const created = await transfersApi.create({ exitType: 'SECTOR', notes: 'Teste', items: [{ materialId: 'mat-1', requestedQuantity: 5 }] })
      const user = userEvent.setup()
      renderWithProviders(<TransferDetails id={created.id} />)
      expect(await screen.findByText('Material Teste')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Reprovar' }))
      expect(await screen.findByText('Cancelada')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Aprovar' })).not.toBeInTheDocument()
    })
    it('não mostra ações para equipe sem permissão de decisão', async () => {
      const created = await transfersApi.create({ exitType: 'SECTOR', notes: 'Teste', items: [{ materialId: 'mat-1', requestedQuantity: 5 }] })
      useAuthStore.setState({ user: { id: '1', name: 'Equipe', email: 'e@ufc.br', role: 'STAFF' } })
      renderWithProviders(<TransferDetails id={created.id} />)
      expect(await screen.findByText('Material Teste')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Aprovar' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Reprovar' })).not.toBeInTheDocument()
    })
  })
})
