import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { CreateEntryDialog } from '@/features/entries/components/CreateEntryDialog'
import type { CreateEntryPayload } from '@/features/entries/types'
import { renderWithProviders } from '@/test/render'

describe('Moeda brasileira no cadastro de entrada', () => {
  let submitted: CreateEntryPayload | undefined

  beforeEach(() => {
    submitted = undefined
    server.use(
      http.get('/suppliers', () => HttpResponse.json([{ id: '11111111-1111-4111-8111-111111111111', corporateName: 'Fornecedor teste' }])),
      http.post('/entries', async ({ request }) => {
        submitted = await request.json() as CreateEntryPayload
        return HttpResponse.json({ id: 'entry-currency' }, { status: 201 })
      }),
    )
  })

  async function fillInvoice() {
    const user = userEvent.setup()
    renderWithProviders(<CreateEntryDialog open onOpenChange={vi.fn()} />)
    await user.type(screen.getByLabelText('Data e hora de chegada'), '2026-11-18T10:00')
    await user.click(screen.getByRole('combobox', { name: 'Fornecedor' }))
    await user.click(await screen.findByRole('option', { name: 'Fornecedor teste' }))
    await user.type(screen.getByLabelText('Nº da NF'), 'NF-1')
    await user.type(screen.getByLabelText('Data de Emissão da NF'), '2026-11-18')
    await user.type(screen.getByLabelText('Licitação'), 'LIC-1')
    await user.type(screen.getByLabelText('Empenho'), 'EMP-1')
    return user
  }

  it.each([
    ['4.700,00', '4.700,00', 4700],
    ['4700,00', '4.700,00', 4700],
    ['4700.00', '4.700,00', 4700],
    ['4,70', '4,70', 4.7],
  ] as const)('aceita %s e envia o valor numérico correto', async (typed, formatted, expected) => {
    const user = await fillInvoice()
    const input = screen.getByLabelText('Valor Total (R$)')
    await user.type(input, typed)
    expect(input).toHaveValue(typed)
    await user.tab()
    expect(input).toHaveValue(formatted)
    await user.click(screen.getByRole('button', { name: 'Criar entrada' }))
    await waitFor(() => expect(submitted?.supplierDetails?.totalAmount).toBe(expected))
    expect(typeof submitted?.supplierDetails?.totalAmount).toBe('number')
  })

  it('não transforma 4.70000 em 4,70 nem envia um valor ambíguo', async () => {
    const user = await fillInvoice()
    const input = screen.getByLabelText('Valor Total (R$)')
    await user.type(input, '4.70000')
    await user.click(screen.getByRole('button', { name: 'Criar entrada' }))
    expect(await screen.findByText('Informe um valor válido, como 4.700,00, com até 2 casas decimais')).toBeInTheDocument()
    expect(input).toHaveValue('4.70000')
    expect(submitted).toBeUndefined()
  })
})
