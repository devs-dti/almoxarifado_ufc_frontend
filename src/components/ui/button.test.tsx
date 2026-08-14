import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

import { Button } from './button'
import { renderWithProviders } from '@/test/render'

describe('Button', () => {
  it('renders an accessible button with variant styling', () => {
    renderWithProviders(<Button variant="destructive">Remover</Button>)

    const button = screen.getByRole('button', { name: 'Remover' })

    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-red-500')
  })

  it('does not call click handlers while disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    renderWithProviders(
      <Button disabled onClick={onClick}>
        Salvar
      </Button>
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(onClick).not.toHaveBeenCalled()
  })
})
