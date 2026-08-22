import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'

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
import type { Entry } from '@/features/entries/types'
import { renderWithProviders } from '@/test/render'
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
      expect(newEntry.status).toBe('PENDING')
      expect(newEntry.entryType).toBe('DONATION')
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
    it('allows cancelling the dialog', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()

      renderWithProviders(<CreateEntryDialog open={true} onOpenChange={onOpenChange} />)

      await user.click(screen.getByRole('button', { name: 'Cancelar' }))
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('AddItemDialog Component', () => {
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

  describe('EntryAccordion Component', () => {
    it('expands to show item details and action buttons for pending entry', async () => {
      const pendingEntry: Entry = {
        id: 'entry-pending-unique',
        status: 'PENDING',
        entryType: 'SUPPLIER',
        responsible: 'Gestor Teste',
        arrivalAt: '2025-06-01T10:00:00Z',
        items: [
          {
            id: 'item-1',
            materialName: 'Papel A4',
            quantity: 10,
            expirationType: 'NON_EXPIRING',
          },
        ],
      }
      const user = userEvent.setup()

      renderWithProviders(<EntryAccordion entry={pendingEntry} />)

      expect(screen.getByText('Entrada #entry-pending-unique')).toBeInTheDocument()

      // Click to expand
      await user.click(screen.getByText('Entrada #entry-pending-unique'))

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /adicionar item/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
      })
    })

    it('finishes a pending entry when clicking Finalizar', async () => {
      const entry = await entriesApi.create({ entryType: 'DONATION', arrivalAt: '2025-06-01T10:00:00Z' })
      await entriesApi.addItem(entry.id, { materialId: 'mat-1', quantity: 10, expirationType: 'NON_EXPIRING' })
      const updated = await entriesApi.get(entry.id)

      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(<EntryAccordion entry={updated} />)

      await user.click(screen.getByText(new RegExp(`Entrada #${updated.id}`, 'i')))
      const finishBtn = await screen.findByRole('button', { name: /finalizar/i })
      await user.click(finishBtn)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Entrada finalizada!')
      })
    })

    it('cancels a pending entry when clicking Cancelar', async () => {
      const entry = await entriesApi.create({ entryType: 'DONATION', arrivalAt: '2025-06-01T10:00:00Z' })
      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(<EntryAccordion entry={entry} />)

      await user.click(screen.getByText(new RegExp(`Entrada #${entry.id}`, 'i')))
      const cancelBtn = await screen.findByRole('button', { name: /cancelar/i })
      await user.click(cancelBtn)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Entrada cancelada.')
      })
    })

    it('removes an item from pending entry', async () => {
      const entry = await entriesApi.create({ entryType: 'DONATION', arrivalAt: '2025-06-01T10:00:00Z' })
      await entriesApi.addItem(entry.id, { materialId: 'mat-1', quantity: 10, expirationType: 'NON_EXPIRING' })
      const updated = await entriesApi.get(entry.id)

      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(<EntryAccordion entry={updated} />)

      await user.click(screen.getByText(new RegExp(`Entrada #${updated.id}`, 'i')))
      const removeBtn = await screen.findByRole('button', { name: /remover item/i })
      await user.click(removeBtn)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Item removido.')
      })
    })

    it('does not display action buttons for finished entries', async () => {
      const mockFinishedEntry: Entry = {
        id: 'entry-finished-99',
        status: 'FINISHED',
        entryType: 'DONATION',
        responsible: 'Gestor Teste',
        arrivalAt: '2025-06-01T10:00:00Z',
        items: [
          {
            id: 'item-2',
            materialName: 'Caneta Azul',
            quantity: 5,
            expirationType: 'NON_EXPIRING',
          },
        ],
      }
      const user = userEvent.setup()

      renderWithProviders(<EntryAccordion entry={mockFinishedEntry} />)

      expect(screen.getByText('Entrada #entry-finished-99')).toBeInTheDocument()
      expect(screen.getByText('Finalizada')).toBeInTheDocument()

      await user.click(screen.getByText('Entrada #entry-finished-99'))

      await waitFor(() => {
        expect(screen.getByText('Caneta Azul')).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /finalizar/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument()
      })
    })
  })
})
