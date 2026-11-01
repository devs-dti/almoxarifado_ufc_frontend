import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SomaLogo } from '@/shared/components/SomaLogo'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f6fa] text-slate-900 lg:grid lg:grid-cols-[minmax(360px,0.9fr)_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#251448] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div aria-hidden="true" className="absolute -right-32 top-1/4 h-96 w-96 rounded-full border border-white/10 shadow-[0_0_0_70px_rgba(255,255,255,0.025),0_0_0_140px_rgba(255,255,255,0.025)]" />
        <Link href="/" className="relative flex w-fit items-center gap-3">
          <span className="rounded-xl bg-white p-2"><SomaLogo className="h-12" /></span>
          <span><strong className="block text-lg leading-tight">Sistema Soma</strong><span className="text-xs text-violet-200">Almoxarifado UFC Sobral</span></span>
        </Link>
        <div className="relative max-w-md py-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">Gestão de almoxarifado</p>
          <h2 className="text-4xl font-semibold leading-[1.15] tracking-tight xl:text-5xl">Organização que faz a diferença no dia a dia.</h2>
          <p className="mt-6 max-w-sm text-base leading-7 text-violet-200">Materiais, movimentações e informações reunidos em um só lugar para apoiar o trabalho da equipe.</p>
        </div>
        <div className="relative flex items-center justify-between border-t border-white/15 pt-6 text-sm text-violet-200"><span>Universidade Federal do Ceará</span><ArrowUpRight size={18} aria-hidden="true" /></div>
      </section>
      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-12">
        <Link href="/" className="flex w-fit items-center gap-2 text-sm font-semibold text-violet-900 lg:hidden"><SomaLogo className="h-10" /> Sistema Soma</Link>
        <div className="flex flex-1 items-center justify-center py-12">{children}</div>
        <p className="text-center text-xs text-slate-500">Almoxarifado UFC Sobral · Desenvolvido pela DTI-UFC</p>
      </section>
    </main>
  )
}
