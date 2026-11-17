import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { toast } from 'sonner'
import { server } from '@/infrastructure/mocks/server'
import { UserFormDialog } from '@/features/users/components/UserFormDialog'
import type { UserDetail } from '@/features/users/types'
import { renderWithProviders } from '@/test/render'

const sectorId = '11111111-1111-4111-8111-111111111111'
const original: UserDetail = {
  id: 'user-edit', name: 'Maria', email: 'maria@ufc.br', cpf: '12345678901',
  jobTitle: 'Técnica', role: 'STAFF', enabled: true,
  sector: { id: sectorId, name: 'Secretaria', code: 'SEC' },
}

describe('Atualização parcial de usuário', () => {
  let requests: FormData[]

  beforeEach(() => {
    requests = []
    server.use(
      http.get('/users/user-edit', () => HttpResponse.json(original)),
      http.get('/sectors', () => HttpResponse.json([original.sector])),
      http.patch('/users/user-edit', async ({ request }) => {
        requests.push(await request.formData())
        return new HttpResponse(null, { status: 204 })
      }),
    )
  })

  it('envia apenas o nome alterado, sem reenviar CPF, e-mail ou os demais dados', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserFormDialog open editing={original} onOpenChange={() => {}} />)
    const name = await screen.findByDisplayValue('Maria')
    await user.clear(name)
    await user.type(name, 'Maria Silva')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(requests).toHaveLength(1))
    expect(Object.fromEntries(requests[0].entries())).toEqual({ name: 'Maria Silva' })
  })

  it('não faz PATCH quando os valores não mudaram, inclusive CPF recebido com máscara', async () => {
    server.use(http.get('/users/user-edit', () => HttpResponse.json({ ...original, cpf: '123.456.789-01' })))
    const info = vi.spyOn(toast, 'info')
    try {
      const user = userEvent.setup()
      renderWithProviders(<UserFormDialog open editing={original} onOpenChange={() => {}} />)
      const name = await screen.findByDisplayValue('Maria')
      await user.type(name, ' Silva')
      await user.clear(name)
      await user.type(name, 'Maria')
      await user.click(screen.getByRole('button', { name: 'Salvar' }))
      await waitFor(() => expect(info).toHaveBeenCalledWith('Nenhuma alteração realizada.'))
      expect(requests).toHaveLength(0)
    } finally {
      info.mockRestore()
    }
  })

  it('envia CPF e e-mail quando foram realmente alterados', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserFormDialog open editing={original} onOpenChange={() => {}} />)
    await screen.findByDisplayValue('Maria')
    await user.clear(screen.getByLabelText('CPF'))
    await user.type(screen.getByLabelText('CPF'), '98765432100')
    await user.clear(screen.getByLabelText('E-mail'))
    await user.type(screen.getByLabelText('E-mail'), 'maria.nova@ufc.br')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(requests).toHaveLength(1))
    expect(Object.fromEntries(requests[0].entries())).toEqual({ cpf: '98765432100', email: 'maria.nova@ufc.br' })
  })

  it('envia enabled=false ao desativar, sem reenviar os outros campos', async () => {
    const user = userEvent.setup()
    renderWithProviders(<UserFormDialog open editing={original} onOpenChange={() => {}} />)
    await screen.findByDisplayValue('Maria')
    await user.click(screen.getByRole('combobox', { name: 'Status' }))
    await user.click(await screen.findByRole('option', { name: 'Inativo' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(requests).toHaveLength(1))
    expect(Object.fromEntries(requests[0].entries())).toEqual({ enabled: 'false' })
  })

  it('envia somente a nova senha e a foto escolhida quando os dados cadastrais não mudam', async () => {
    vi.stubGlobal('URL', class extends URL {
      static createObjectURL = vi.fn(() => 'blob:nova-foto')
      static revokeObjectURL = vi.fn()
    })
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(<UserFormDialog open editing={original} onOpenChange={() => {}} />)
    try {
      await screen.findByDisplayValue('Maria')
      await user.type(screen.getByLabelText('Nova Senha (opcional)'), 'NovaSenha123')
      await user.upload(screen.getByLabelText(/foto do usuário/i), new File(['imagem'], 'nova-foto.png', { type: 'image/png' }))
      await user.click(screen.getByRole('button', { name: 'Salvar' }))
      await waitFor(() => expect(requests).toHaveLength(1))
      expect([...requests[0].keys()].sort()).toEqual(['file', 'password'])
      expect(requests[0].get('password')).toBe('NovaSenha123')
      expect((requests[0].get('file') as File).name).toBe('nova-foto.png')
    } finally {
      unmount()
      vi.unstubAllGlobals()
    }
  })
})
