import { LoginForm } from './LoginForm'

export function AuthCard() {
  return (
    <div className="w-full max-w-md">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Bem-vindo ao Soma</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Acesse sua conta</h1>
      <p className="mt-3 mb-8 text-sm leading-6 text-slate-600">Entre com seu e-mail e senha para acessar o almoxarifado.</p>
      <LoginForm />
      <p className="mt-8 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500">Precisa de acesso? Entre em contato com a administração do almoxarifado.</p>
    </div>
  )
}
