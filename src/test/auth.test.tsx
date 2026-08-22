import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

import { useAuthStore } from '@/store/useAuthStore'
import { authApi } from '@/features/auth/api'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { DashboardHeader } from '@/features/auth/components/DashboardHeader'
import { AuthInit } from '@/features/auth/components/AuthInit'
import { usersApi } from '@/features/users/api'
import { renderWithProviders } from '@/test/render'
import { mockPush } from '@/test/setup'

describe('Auth Flow', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: false })
    Cookies.remove('auth-token')
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('useAuthStore', () => {
    it('initializes with default unauthenticated state', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.isAuthenticated()).toBe(false)
    })

    it('logs in successfully and sets user in store', async () => {
      await useAuthStore.getState().login({
        email: 'admin@ufc.br',
        password: 'password123',
      })

      const state = useAuthStore.getState()
      expect(state.user?.email).toBe('admin@ufc.br')
      expect(state.user?.name).toBe('Daniele Silva')
      expect(state.isAuthenticated()).toBe(true)
    })

    it('handles login failure and sets loading back to false', async () => {
      let threw = false
      try {
        await useAuthStore.getState().login({
          email: '',
          password: '',
        })
      } catch {
        threw = true
      }

      expect(threw).toBe(true)
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.isAuthenticated()).toBe(false)
    })

    it('fetches authenticated user details with fetchMe', async () => {
      await useAuthStore.getState().fetchMe()

      const state = useAuthStore.getState()
      expect(state.user?.name).toBe('Daniele Silva')
      expect(state.user?.email).toBe('admin@ufc.br')
      expect(state.user?.role).toBe('ADMIN')
    })

    it('logs out and clears store state', async () => {
      useAuthStore.getState().setAuth({
        id: '1',
        name: 'Daniele Silva',
        email: 'admin@ufc.br',
        role: 'ADMIN',
      })

      expect(useAuthStore.getState().isAuthenticated()).toBe(true)

      await useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated()).toBe(false)
    })
  })

  describe('authApi', () => {
    it('calls login endpoint and returns user', async () => {
      const response = await authApi.login({
        email: 'admin@ufc.br',
        password: 'password123',
      })

      expect(response.email).toBe('admin@ufc.br')
      expect(response.name).toBe('Daniele Silva')
    })

    it('calls me endpoint and returns current user', async () => {
      const user = await authApi.me()
      expect(user.name).toBe('Daniele Silva')
      expect(user.role).toBe('ADMIN')
    })

    it('calls refreshToken, forgotPassword and resetPassword endpoints', async () => {
      const refreshRes = await authApi.refreshToken()
      expect(refreshRes.token).toBeDefined()

      const forgotRes = await authApi.forgotPassword({ email: 'user@ufc.br' })
      expect(forgotRes.status).toBe(200)

      const resetRes = await authApi.resetPassword('token-123', {
        password: 'newpassword123',
        confirmPassword: 'newpassword123',
      })
      expect(resetRes.status).toBe(200)

      const logoutRes = await authApi.logout()
      expect(logoutRes.status).toBe(204)
    })
  })

  describe('LoginForm Component', () => {
    it('renders email, password inputs, submit button and links', () => {
      renderWithProviders(<LoginForm />)

      expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
      expect(screen.getByText(/lembrar meu e-mail/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /esqueceu a senha\?/i })).toBeInTheDocument()
    })

    it('validates required fields and shows validation messages', async () => {
      const user = userEvent.setup()
      renderWithProviders(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email obrigatório')).toBeInTheDocument()
        expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
      })
    })

    it('successfully submits valid credentials, updates store, displays toast and navigates to dashboard', async () => {
      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')

      renderWithProviders(<LoginForm />)

      const emailInput = screen.getByPlaceholderText('seu@email.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      await user.type(emailInput, 'admin@ufc.br')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(toastSuccessSpy).toHaveBeenCalledWith('Login bem-sucedido!')
        expect(mockPush).toHaveBeenCalledWith('/dashboard')
        expect(useAuthStore.getState().isAuthenticated()).toBe(true)
      })
    })
  })

  describe('RegisterForm Component', () => {
    it('renders name, email, password and confirmPassword fields', () => {
      renderWithProviders(<RegisterForm />)

      expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^senha/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirme a senha/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument()
    })

    it('validates password mismatch', async () => {
      const user = userEvent.setup()
      renderWithProviders(<RegisterForm />)

      await user.type(screen.getByPlaceholderText('Seu nome completo'), 'Test User')
      await user.type(screen.getByPlaceholderText('seu@email.com'), 'test@ufc.br')
      await user.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), 'password123')
      await user.type(screen.getByPlaceholderText('Repita a senha'), 'differentpassword')

      await user.click(screen.getByRole('button', { name: /cadastrar/i }))

      await waitFor(() => {
        expect(screen.getByText('Senhas não coincidem')).toBeInTheDocument()
      })
    })

    it('successfully creates a user and displays confirmation toast', async () => {
      const user = userEvent.setup()
      const toastSuccessSpy = vi.spyOn(toast, 'success')
      const createSpy = vi.spyOn(usersApi, 'create').mockResolvedValueOnce({
        id: 'user-new',
        name: 'Novo Usuário',
        email: 'novo@ufc.br',
        role: 'STAFF',
      })

      renderWithProviders(<RegisterForm />)

      await user.type(screen.getByPlaceholderText('Seu nome completo'), 'Novo Usuário')
      await user.type(screen.getByPlaceholderText('seu@email.com'), 'novo@ufc.br')
      await user.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), 'password123')
      await user.type(screen.getByPlaceholderText('Repita a senha'), 'password123')

      await user.click(screen.getByRole('button', { name: /cadastrar/i }))

      await waitFor(() => {
        expect(createSpy).toHaveBeenCalled()
        expect(toastSuccessSpy).toHaveBeenCalledWith('Conta criada! Faça login para continuar.')
      })
    })
  })

  describe('DashboardHeader Component', () => {
    it('displays user greeting and avatar initials when logged in', () => {
      useAuthStore.setState({
        user: {
          id: '1',
          name: 'Carlos Oliveira',
          email: 'carlos@ufc.br',
          role: 'MANAGER',
        },
      })

      renderWithProviders(<DashboardHeader />)

      expect(screen.getByText(/olá, carlos!/i)).toBeInTheDocument()
      expect(screen.getByText('carlos@ufc.br')).toBeInTheDocument()
      const initials = screen.getAllByText('C')
      expect(initials.length).toBeGreaterThan(0)
    })

    it('falls back gracefully when user data is not loaded', () => {
      useAuthStore.setState({ user: null })

      renderWithProviders(<DashboardHeader />)

      expect(screen.getByText(/olá, usuário!/i)).toBeInTheDocument()
      const fallbacks = screen.getAllByText('U')
      expect(fallbacks.length).toBeGreaterThan(0)
    })
  })

  describe('AuthInit Component', () => {
    it('calls fetchMe on mount if user exists in state', async () => {
      const fetchMeSpy = vi.fn().mockResolvedValue(undefined)
      useAuthStore.setState({
        user: {
          id: '1',
          name: 'Carlos Oliveira',
          email: 'carlos@ufc.br',
          role: 'MANAGER',
        },
        fetchMe: fetchMeSpy,
      })

      renderWithProviders(<AuthInit />)

      await waitFor(() => {
        expect(fetchMeSpy).toHaveBeenCalledTimes(1)
      })
    })

    it('does not call fetchMe if user is null', () => {
      const fetchMeSpy = vi.fn().mockResolvedValue(undefined)
      useAuthStore.setState({
        user: null,
        fetchMe: fetchMeSpy,
      })

      renderWithProviders(<AuthInit />)

      expect(fetchMeSpy).not.toHaveBeenCalled()
    })
  })
})
