import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'

import { useAuthStore } from '@/store/useAuthStore'
import { entriesApi } from '@/features/entries/api'
import {
  useEntries,
  useEntry,
  useCreateEntry,
  useAddEntryItem,
  useRemoveEntryItem,
  useFinishEntry,
  useCancelEntry,
} from '@/features/entries/hooks'
import { EntryList } from '@/features/entries/components/EntryList'
import { CreateEntryDialog } from '@/features/entries/components/CreateEntryDialog'
import { AddItemDialog } from '@/features/entries/components/AddItemDialog'
import { EntryAccordion } from '@/features/entries/components/EntryAccordion'
import { EntryDetails } from '@/features/entries/components/EntryDetails'
import type { Entry } from '@/features/entries/types'
import { renderWithProviders } from '@/test/render'
import { mockPush } from '@/test/setup'
import { renderHook } from '@testing-library/react'
import { createTestQueryClient } from '@/test/render'
import { QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

describe('Entradas (Entries) Flow', () => {
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

  describe('entriesApi & Hooks', () => {
    it('lists entries with pagination', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useEntries({ page: 0, size: 10 }), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.content).toBeDefined()
      expect(result.current.data?.content.length).toBeGreaterThan(0)
      expect(result.current.data?.totalElements).toBeGreaterThanOrEqual(2)
    })

    it('fetches a single entry by ID', async () => {
      const list = await entriesApi.list()
      const firstId = list.content[0].id

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useEntry(firstId), { wrapper })

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(result.current.data?.id).toBe(firstId)
      expect(result.current.data?.status).toBeDefined()
    })

    it('creates a new entry via useCreateEntry', async () => {
      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useCreateEntry(), { wrapper })

      const newEntry = await result.current.mutateAsync({
        entryType: 'DONATION',
        arrivalAt: '2025-06-01T10:00:00Z',
      })

      expect(newEntry.id).toBeDefined()
      const details = await entriesApi.get(newEntry.id)
      expect(details.status).toBe('PENDING')
      expect(details.entryType).toBe('DONATION')
    })

    it('adds an item to an entry via useAddEntryItem', async () => {
      const list = await entriesApi.list()
      const entryId = list.content[0].id

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useAddEntryItem(), { wrapper })

      const added = await result.current.mutateAsync({
        entryId,
        data: {
          materialId: 'mat-1',
          quantity: 25,
          expirationType: 'NON_EXPIRING',
        },
      })

      expect(added.id).toBeDefined()
      expect(added.quantity).toBe(25)
    })

    it('removes an item from an entry via useRemoveEntryItem', async () => {
      const list = await entriesApi.list()
      const pendingEntry = list.content.find((e) => e.items.length > 0) || list.content[0]
      const itemId = pendingEntry.items[0]?.id || 'item-1'

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useRemoveEntryItem(), { wrapper })

      await expect(
        result.current.mutateAsync({ entryId: pendingEntry.id, itemId })
      ).resolves.toBeDefined()
    })

    it('finishes an entry via useFinishEntry', async () => {
      const list = await entriesApi.list()
      const entryId = list.content[0].id

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useFinishEntry(), { wrapper })

      const finished = await result.current.mutateAsync(entryId)
      expect(finished.status).toBe('FINISHED')
    })

    it('cancels an entry via useCancelEntry', async () => {
      const list = await entriesApi.list()
      const entryId = list.content[0].id

      const { wrapper } = createWrapper()
      const { result } = renderHook(() => useCancelEntry(), { wrapper })

      const canceled = await result.current.mutateAsync(entryId)
      expect(canceled.status).toBe('CANCELED')
    })
  })

  describe('EntryList Component', () => {
    it('envia paginação e ordenação e volta à primeira página ao alterar opções', async () => {
      const requests: string[] = []
      server.use(http.get('/entries', ({ request }) => {
        const params = new URL(request.url).searchParams
        requests.push(params.toString())
        const page = Number(params.get('page'))
        const size = Number(params.get('size'))
        return HttpResponse.json({ data: [{ id: `entry-${page}`, status: 'PENDING', entryType: 'DONATION', arrivalAt: '2025-06-01' }], meta: { page, size, totalElements: 25, totalPages: Math.ceil(25 / size) } })
      }))
      const user = userEvent.setup()
      renderWithProviders(<EntryList />)
      expect(await screen.findByText('Mostrando 1–10 de 25 entradas')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Próxima página' }))
      expect(await screen.findByText('Mostrando 11–20 de 25 entradas')).toBeInTheDocument()
      await user.selectOptions(screen.getByLabelText('Ordenar por'), 'arrivalAt,desc')
      expect(await screen.findByText('Mostrando 1–10 de 25 entradas')).toBeInTheDocument()
      expect(new URLSearchParams(requests.at(-1)).get('sort')).toBe('arrivalAt,desc')
      await user.selectOptions(screen.getByLabelText('Entradas por página'), '20')
      expect(await screen.findByText('Mostrando 1–20 de 25 entradas')).toBeInTheDocument()
      expect(new URLSearchParams(requests.at(-1)).get('size')).toBe('20')
    })

    it('renders the header and "Nova Entrada" button for MANAGER role', async () => {
      renderWithProviders(<EntryList />)

      expect(screen.getByRole('heading', { name: 'Entradas' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /nova entrada/i })).toBeInTheDocument()

      await waitFor(() => {
        const entries = screen.getAllByText(/entrada #/i)
        expect(entries.length).toBeGreaterThan(0)
      })
    })

    it('hides "Nova Entrada" button for users without permission', () => {
      useAuthStore.setState({
        user: null,
      })

      renderWithProviders(<EntryList />)

      expect(screen.queryByRole('button', { name: /nova entrada/i })).not.toBeInTheDocument()
    })

    it('opens CreateEntryDialog when clicking "Nova Entrada"', async () => {
      const user = userEvent.setup()
      renderWithProviders(<EntryList />)

      const newEntryBtn = screen.getByRole('button', { name: /nova entrada/i })
      await user.click(newEntryBtn)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Nova Entrada' })).toBeInTheDocument()
      })
    })
  })

  describe('CreateEntryDialog Component', () => {
    it('abre os detalhes da entrada criada', async () => {
      const user = userEvent.setup()
      renderWithProviders(<CreateEntryDialog open={true} onOpenChange={vi.fn()} />)
      await user.click(screen.getByRole('combobox', { name: /tipo de entrada/i }))
      await user.click(screen.getByRole('option', { name: 'Doação' }))
      await user.type(screen.getByLabelText(/data e hora de chegada/i), '2026-10-28T10:00')
      await user.click(screen.getByRole('button', { name: 'Criar entrada' }))
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith(expect.stringMatching(/^\/dashboard\/entradas\/[a-f0-9-]+$/)))
      const id = mockPush.mock.calls[0][0].split('/').pop()
      expect((await entriesApi.get(id)).id).toBe(id)
    })

    it('allows cancelling the dialog', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(<CreateEntryDialog open={true} onOpenChange={onOpenChange} />)

      await user.click(screen.getByRole('button', { name: 'Cancelar' }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('AddItemDialog Component', () => {
    it('busca no servidor por nome ou código, pagina e permite selecionar um resultado', async () => {
      const requests: string[] = []
      server.use(http.get('/materials', ({ request }) => {
        const params = new URL(request.url).searchParams
        requests.push(params.toString())
        const page = Number(params.get('page'))
        return HttpResponse.json({ data: [{ id: `material-${page}`, name: `Material ${page}`, internalCode: `COD-${page}`, measurementUnitName: 'Unidade' }], meta: { page, size: 8, totalElements: 9, totalPages: 2 } })
      }))
      const user = userEvent.setup()
      renderWithProviders(<AddItemDialog entryId="entry-100" open onOpenChange={vi.fn()} />)
      await user.type(screen.getByRole('textbox', { name: 'Buscar material' }), 'luva')
      expect(await screen.findByRole('button', { name: /material 0/i })).toBeInTheDocument()
      expect(new URLSearchParams(requests.at(-1)).get('search')).toBe('luva')
      await user.click(screen.getByRole('button', { name: 'Próxima' }))
      await user.click(await screen.findByRole('button', { name: /material 1/i }))
      expect(screen.getByRole('button', { name: 'Alterar material' })).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Alterar material' }))
      await user.selectOptions(screen.getByLabelText('Buscar material por'), 'code')
      await user.type(screen.getByRole('textbox', { name: 'Buscar material' }), 'COD')
      await waitFor(() => expect(new URLSearchParams(requests.at(-1)).get('internalCode')).toBe('COD'))
    })

    it('renders add item dialog inputs and handles validation', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(
        <AddItemDialog entryId="entry-100" open={true} onOpenChange={onOpenChange} />
      )

      expect(screen.getByRole('heading', { name: 'Adicionar Item' })).toBeInTheDocument()
      expect(screen.getByLabelText(/quantidade/i)).toBeInTheDocument()

      // Clicking submit without selecting material triggers validation
      await user.click(screen.getByRole('button', { name: 'Adicionar' }))

      await waitFor(() => {
        expect(screen.getByText('Selecione um material')).toBeInTheDocument()
      })
    })
  })

  describe('Detalhes da entrada', () => {
    it('exige a soma exata dos itens antes de finalizar entrada de fornecedor', async () => {
      server.use(http.get('/entries/invoice-check', () => HttpResponse.json({ id: 'invoice-check', status: 'PENDING', entryType: 'SUPPLIER', arrivalAt: '2025-06-01', items: [{ id: 'item-check', materialName: 'Material', quantity: 2, expirationType: 'NON_EXPIRING' }], supplierDetails: { supplierId: 'supplier', supplierName: 'Fornecedor', invoiceNumber: 'NF', invoiceIssueDate: '2025-06-01', totalAmount: 10, biddingCode: 'L', commitmentNote: 'E' } })))
      const user = userEvent.setup()
      renderWithProviders(<EntryDetails id="invoice-check" />)
      const price = await screen.findByLabelText('Valor unitário (R$)')
      const finish = screen.getByRole('button', { name: /finalizar entrada/i })
      expect(finish).toBeDisabled()
      await user.type(price, '4.99')
      expect(finish).toBeDisabled()
      expect(screen.getByText(/abaixo do total/)).toBeInTheDocument()
      await user.clear(price)
      await user.type(price, '5')
      expect(screen.getByText('Os valores conferem.')).toBeInTheDocument()
      expect(finish).toBeEnabled()
    })

    it('mostra os dados fiscais de uma entrada de fornecedor', async () => {
      renderWithProviders(<EntryDetails id="00000000-0000-4000-8000-000000000051" />)
      expect(await screen.findByRole('heading', { name: 'Dados da nota fiscal' })).toBeInTheDocument()
      expect(screen.getByText('Papelaria Central')).toBeInTheDocument()
      expect(screen.getByText('NF-1001')).toBeInTheDocument()
      expect(screen.getByText('30/05/2025')).toBeInTheDocument()
      expect(screen.getAllByText(/1\.500,00/).length).toBeGreaterThan(0)
      expect(screen.getByText('LIC-001')).toBeInTheDocument()
      expect(screen.getByText('EMP-001')).toBeInTheDocument()
    })

    it('não exibe nota fiscal em entradas de doação', async () => {
      const entry = await entriesApi.create({ entryType: 'DONATION', arrivalAt: '2025-06-01T10:00:00Z' })
      renderWithProviders(<EntryDetails id={entry.id} />)
      expect(await screen.findByText('Doação')).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Dados da nota fiscal' })).not.toBeInTheDocument()
    })

    it('oferece um link para a página da entrada', () => {
      const entry: Entry = { id: 'entry-1', status: 'PENDING', entryType: 'DONATION', arrivalAt: '2025-06-01', items: [] }
      renderWithProviders(<EntryAccordion entry={entry} />)
      expect(screen.getByRole('link', { name: /entrada #entry-1/i })).toHaveAttribute('href', '/dashboard/entradas/entry-1')
    })

    it('carrega os detalhes e permite finalizar uma entrada com itens', async () => {
      const entry = await entriesApi.create({ entryType: 'DONATION', arrivalAt: '2025-06-01T10:00:00Z' })
      await entriesApi.addItem(entry.id, { materialId: 'mat-1', quantity: 10, expirationType: 'NON_EXPIRING' })
      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')
      renderWithProviders(<EntryDetails id={entry.id} />)
      expect(await screen.findByText('Material Teste')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /finalizar entrada/i }))
      await waitFor(() => expect(toastSuccessSpy).toHaveBeenCalledWith('Entrada finalizada!'))
      expect(await screen.findByText('Finalizada')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /adicionar item/i })).not.toBeInTheDocument()
    })

    it('permite remover itens e cancelar uma entrada pendente', async () => {
      const entry = await entriesApi.create({ entryType: 'DONATION', arrivalAt: '2025-06-01T10:00:00Z' })
      await entriesApi.addItem(entry.id, { materialId: 'mat-1', quantity: 10, expirationType: 'NON_EXPIRING' })
      const user = userEvent.setup()
      renderWithProviders(<EntryDetails id={entry.id} />)
      await user.click(await screen.findByRole('button', { name: /remover item/i }))
      expect(await screen.findByText('Nenhum item adicionado.')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /cancelar entrada/i }))
      expect(await screen.findByText('Cancelada')).toBeInTheDocument()
    })
  })
})
