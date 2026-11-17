import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { MaterialFormDialog } from '@/features/materials/components/MaterialFormDialog'
import { MaterialList } from '@/features/materials/components/MaterialList'
import type { Material } from '@/features/materials/types'
import { useAuthStore } from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/render'

const material: Material = {
  id: 'optional-group', name: 'Material sem grupo', internalCode: 'SEM-001',
  minQuantity: 1, materialGroupName: null, measurementUnitName: 'Unidade',
}
const details = {
  ...material, description: null, imageUrl: null, updatedAt: null,
  materialGroup: null, measurementUnit: { id: 'unit-1', name: 'Unidade' },
}

describe('Grupo opcional de materiais', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { id: 'admin', name: 'Administrador', role: 'ADMIN' } })
    server.use(
      http.get('/measurement-units', () => HttpResponse.json([{ id: 'unit-1', name: 'Unidade', abbreviation: 'un' }])),
      http.get('/material-groups', () => HttpResponse.json([])),
      http.get('/materials/optional-group', () => HttpResponse.json(details)),
    )
  })

  it('cadastra sem grupo e omite o campo no multipart, mantendo a unidade obrigatória', async () => {
    let submitted: FormData | undefined
    server.use(http.post('/materials', async ({ request }) => {
      submitted = await request.formData()
      return new HttpResponse(null, { status: 201 })
    }))
    const user = userEvent.setup()
    renderWithProviders(<MaterialFormDialog open onOpenChange={() => {}} />)
    await user.type(screen.getByLabelText('Nome'), 'Material sem grupo')
    await user.type(screen.getByLabelText('Código Interno'), 'SEM-001')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(await screen.findByText('Selecione uma unidade de medida')).toBeInTheDocument()
    expect(submitted).toBeUndefined()

    await user.click(screen.getByRole('combobox', { name: 'Unidade de medida' }))
    await user.click(await screen.findByRole('option', { name: 'Unidade (un)' }))
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))
    await waitFor(() => expect(submitted?.get('measurementUnitId')).toBe('unit-1'))
    expect(submitted?.has('materialGroupId')).toBe(false)
    expect(submitted?.get('name')).toBe('Material sem grupo')
  })

  it('apresenta Sem grupo na listagem e nos detalhes', async () => {
    server.use(http.get('/materials', () => HttpResponse.json({
      data: [material], meta: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
    })))
    const user = userEvent.setup()
    renderWithProviders(<MaterialList />)
    expect(await screen.findByText('Sem grupo')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Ver detalhes de Material sem grupo' }))
    const dialog = await screen.findByRole('dialog', { name: 'Detalhes do material' })
    expect(await within(dialog).findByText('Sem grupo')).toBeInTheDocument()
  })

  it('permite associar um grupo ao editar um material cadastrado sem grupo', async () => {
    let submitted: FormData | undefined
    server.use(
      http.get('/material-groups', () => HttpResponse.json([{ id: 'group-1', name: 'Papelaria' }])),
      http.patch('/materials/optional-group', async ({ request }) => {
        submitted = await request.formData()
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<MaterialFormDialog open editing={material} onOpenChange={() => {}} />)
    const select = await screen.findByRole('combobox', { name: 'Grupo (opcional)' })
    expect(select).toHaveTextContent('Sem grupo')
    await user.click(select)
    await user.click(await screen.findByRole('option', { name: 'Papelaria' }))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(submitted?.get('materialGroupId')).toBe('group-1'))
    expect(submitted?.has('measurementUnitId')).toBe(false)
  })

  it('preserva o grupo atual mesmo quando ele não aparece na página de grupos', async () => {
    let submitted: FormData | undefined
    server.use(
      http.get('/materials/optional-group', () => HttpResponse.json({ ...details, materialGroup: { id: 'old-group', name: 'Grupo atual' } })),
      http.patch('/materials/optional-group', async ({ request }) => {
        submitted = await request.formData()
        return new HttpResponse(null, { status: 204 })
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<MaterialFormDialog open editing={{ ...material, materialGroupName: 'Grupo atual' }} onOpenChange={() => {}} />)
    const select = await screen.findByRole('combobox', { name: 'Grupo (opcional)' })
    await waitFor(() => expect(select).toHaveTextContent('Grupo atual'))
    await user.click(select)
    expect(await screen.findByRole('option', { name: 'Sem grupo' })).toHaveAttribute('aria-disabled', 'true')
    await user.keyboard('{Escape}')
    await user.type(screen.getByLabelText('Descrição (Opcional)'), 'Descrição atualizada')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))
    await waitFor(() => expect(submitted?.get('description')).toBe('Descrição atualizada'))
    expect(submitted?.has('materialGroupId')).toBe(false)
  })
})
