import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MaterialList } from '@/features/materials/components/MaterialList'
import { useAuthStore } from '@/store/useAuthStore'
import { renderWithProviders } from '@/test/render'

describe('Materiais', () => {
  it('abre os detalhes fornecidos pela API para um usuário da equipe', async () => {
    useAuthStore.setState({ user: { id: '1', name: 'Usuário', email: 'u@ufc.br', role: 'STAFF' } })
    const user = userEvent.setup()
    renderWithProviders(<MaterialList />)
    await user.click(await screen.findByRole('button', { name: 'Ver detalhes de Papel A4' }))
    const dialog = await screen.findByRole('dialog', { name: 'Detalhes do material' })
    expect(await within(dialog).findByText('Papel A4')).toBeInTheDocument()
    expect(within(dialog).getByText('Papelaria')).toBeInTheDocument()
    expect(within(dialog).queryByRole('button', { name: 'Editar material' })).not.toBeInTheDocument()
  })
})
