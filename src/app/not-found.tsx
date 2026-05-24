import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center bg-background">
      <span className="text-5xl font-bold text-brand">404</span>
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-gray-800">Página não encontrada</h2>
        <p className="text-sm text-gray-400">O endereço acessado não existe.</p>
      </div>
      <Link
        href="/dashboard"
        className="mt-2 text-sm font-medium text-brand hover:text-brand-hover underline underline-offset-4"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
