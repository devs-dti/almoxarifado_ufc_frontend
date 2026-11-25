import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/infrastructure/mocks/server'
import { MaterialFormDialog } from '@/features/materials/components/MaterialFormDialog'
import { renderWithProviders } from '@/test/render'

describe('Busca de grupos e unidades no formulário de material', () => {
  it('permite rolar as opções com a roda do mouse dentro do modal e mantém o formulário aberto ao fechar a lista', async () => {
    server.use(http.get('/measurement-units', () => HttpResponse.json(
      Array.from({ length: 10 }, (_, index) => ({ id: `unit-${index}`, name: `Unidade ${index}`, abbreviation: `u${index}` })),
    )))
    const user = userEvent.setup()
    renderWithProviders(<MaterialFormDialog open onOpenChange={() => {}} />)
    const formDialog = screen.getByRole('dialog', { name: 'Novo material' })
    await user.click(screen.getByRole('combobox', { name: 'Unidade de medida' }))
    const option = await screen.findByRole('option', { name: 'Unidade 0 (u0)' })
    const scrollArea = screen.getByRole('listbox', { name: 'Resultados da busca' }).parentElement!
    // JSDOM não calcula layout: fornece uma área com espaço para rolar nos dois sentidos.
    scrollArea.style.overflowY = 'auto'
    Object.defineProperties(scrollArea, {
      clientHeight: { configurable: true, value: 150 },
      scrollHeight: { configurable: true, value: 600 },
    })
    const down = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 })
    fireEvent(option, down)
    expect(down.defaultPrevented).toBe(false)

    scrollArea.scrollTop = 200
    const up = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: -100 })
    fireEvent(option, up)
    expect(up.defaultPrevented).toBe(false)
    await user.keyboard('{Escape}')
    expect(formDialog).toBeVisible()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Unidade de medida' })).toHaveFocus())
  })

  it('pagina e pesquisa grupos no servidor sem apagar os dados preenchidos', async () => {
    const requests: URLSearchParams[] = []
    server.use(http.get('/material-groups', ({ request }) => {
      const params = new URL(request.url).searchParams
      requests.push(params)
      const search = params.get('search') ?? ''
      const page = Number(params.get('page'))
      return HttpResponse.json({
        data: [{ id: search ? 'searched' : `group-${page}`, name: search ? 'Grupo pesquisado' : `Grupo página ${page + 1}` }],
        meta: { page, size: 10, totalElements: search ? 1 : 11, totalPages: search ? 1 : 2 },
      })
    }))
    const user = userEvent.setup()
    renderWithProviders(<MaterialFormDialog open onOpenChange={() => {}} />)
    await user.type(screen.getByLabelText('Nome'), 'Material em preenchimento')
    await user.type(screen.getByLabelText('Código Interno'), 'MAT-001')
    await user.click(screen.getByRole('combobox', { name: 'Grupo (opcional)' }))
    expect(await screen.findByRole('option', { name: 'Grupo página 1' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Próxima página de opções' }))
    expect(await screen.findByRole('option', { name: 'Grupo página 2' })).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Grupo página 2' }))
    expect(screen.getByRole('combobox', { name: 'Grupo (opcional)' })).toHaveTextContent('Grupo página 2')

    await user.click(screen.getByRole('combobox', { name: 'Grupo (opcional)' }))
    await user.type(screen.getByRole('combobox', { name: 'Buscar grupo pelo nome...' }), '  pesquisado  ')
    await user.click(await screen.findByRole('option', { name: 'Grupo pesquisado' }))
    expect(requests.some((params) => params.get('page') === '1' && params.get('size') === '10')).toBe(true)
    expect(requests.some((params) => params.get('search') === 'pesquisado' && params.get('page') === '0')).toBe(true)
    expect(screen.getByRole('combobox', { name: 'Grupo (opcional)' })).toHaveTextContent('Grupo pesquisado')
    expect(screen.getByLabelText('Nome')).toHaveValue('Material em preenchimento')
    expect(screen.getByLabelText('Código Interno')).toHaveValue('MAT-001')
  })

  it('busca unidade pela sigla, seleciona pelo teclado e envia seu ID', async () => {
    let submitted: FormData | undefined
    server.use(
      http.get('/measurement-units', ({ request }) => {
        const params = new URL(request.url).searchParams
        return HttpResponse.json({
          data: params.get('search') === 'kg' ? [{ id: 'unit-kg', name: 'Quilograma', abbreviation: 'kg' }] : [],
          meta: { page: 0, size: 10, totalElements: params.get('search') === 'kg' ? 1 : 0, totalPages: 1 },
        })
      }),
      http.post('/materials', async ({ request }) => {
        submitted = await request.formData()
        return new HttpResponse(null, { status: 201 })
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<MaterialFormDialog open onOpenChange={() => {}} />)
    await user.type(screen.getByLabelText('Nome'), 'Material por peso')
    await user.type(screen.getByLabelText('Código Interno'), 'PESO-001')
    await user.click(screen.getByRole('combobox', { name: 'Unidade de medida' }))
    await user.type(screen.getByRole('combobox', { name: 'Buscar unidade pelo nome ou sigla...' }), 'kg')
    expect(await screen.findByRole('option', { name: 'Quilograma (kg)' })).toBeInTheDocument()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(screen.getByRole('combobox', { name: 'Unidade de medida' })).toHaveTextContent('Quilograma (kg)')
    expect(submitted).toBeUndefined()
    // A seleção permanece visível mesmo em uma nova busca sem resultados.
    await user.click(screen.getByRole('combobox', { name: 'Unidade de medida' }))
    await user.type(screen.getByRole('combobox', { name: 'Buscar unidade pelo nome ou sigla...' }), 'inexistente')
    expect(await screen.findByText('Nenhum resultado para esta busca.')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.getByRole('combobox', { name: 'Unidade de medida' })).toHaveTextContent('Quilograma (kg)')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))
    await waitFor(() => expect(submitted?.get('measurementUnitId')).toBe('unit-kg'))
    expect(submitted?.has('materialGroupId')).toBe(false)
  })

  it('permite tentar novamente após falha e voltar para Sem grupo', async () => {
    let attempts = 0
    server.use(http.get('/material-groups', () => {
      attempts++
      if (attempts === 1) return new HttpResponse(null, { status: 503 })
      return HttpResponse.json([{ id: 'group-1', name: 'Papelaria' }])
    }))
    const user = userEvent.setup()
    renderWithProviders(<MaterialFormDialog open onOpenChange={() => {}} />)
    await user.click(screen.getByRole('combobox', { name: 'Grupo (opcional)' }))
    expect(await screen.findByText('Não foi possível carregar as opções.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await user.click(await screen.findByRole('option', { name: 'Papelaria' }))
    await user.click(screen.getByRole('combobox', { name: 'Grupo (opcional)' }))
    await user.click(screen.getByRole('option', { name: 'Sem grupo' }))
    expect(screen.getByRole('combobox', { name: 'Grupo (opcional)' })).toHaveTextContent('Sem grupo')
  })
})
