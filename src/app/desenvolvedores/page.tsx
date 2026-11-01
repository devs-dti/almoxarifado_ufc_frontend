'use client'

import Link from 'next/link'
import { UfcLogo } from '@/shared/components/UfcLogo'
import { ArrowRight, ArrowLeft, Code2, Sparkles, Terminal } from 'lucide-react'

export default function DesenvolvedoresPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#7C3AED] selection:text-white">
      {/* 1. Header / Navbar */}
      <div className="bg-[#F7F5FE] border-b border-[#EDE9FE]">
        <header className="w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <UfcLogo />
            <span className="flex flex-col leading-tight"><span className="font-bold text-lg text-slate-900 tracking-tight">Sistema Soma</span><span className="text-[11px] text-slate-500 font-medium">Almoxarifado UFC Sobral</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/#sobre" className="hover:text-[#7C3AED] transition-colors">
              Sobre
            </Link>
            <Link href="/#recursos" className="hover:text-[#7C3AED] transition-colors">
              Recursos
            </Link>
            <span className="text-[#7C3AED] font-semibold">
              Desenvolvedores
            </span>
            <Link href="/faq" className="hover:text-[#7C3AED] transition-colors">
              FAQ
            </Link>
          </nav>

          <div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-xs transition-all shadow-sm"
            >
              <span>Acessar Sistema</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        {/* Page Hero */}
        <section className="w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24 pt-16 pb-20 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#7C3AED] bg-[#EDE9FE] px-4 py-1.5 rounded-full mb-5">
            <Terminal size={13} />
            <span>Engenharia e Tecnologia</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-950 tracking-tight leading-[1.1] mb-5">
            Equipe e Desenvolvedores
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Conheça quem projeta, constrói e mantém as soluções digitais da Universidade Federal do Ceará — Campus Sobral.
          </p>
        </section>
      </div>

      {/* 2. Construction Card & Roadmap */}
      <main className="flex-1 py-16 sm:py-24 bg-white flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto px-6 sm:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF8FF] border border-[#EDE9FE] shadow-xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] mb-6 shadow-xs">
              <Code2 size={32} strokeWidth={1.75} />
            </div>

            <span className="text-xs uppercase tracking-wider font-bold text-[#7C3AED] mb-2">
              Página em Construção
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 mb-4 tracking-tight">
              Nosso portfólio está sendo preparado
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md mb-8">
              Estamos estruturando este espaço para destacar os membros da equipe da Divisão de Tecnologia da Informação (DTI), stack tecnológica e contribuições para o Sistema Soma.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
              >
                <ArrowLeft size={14} />
                <span>Voltar para o Início</span>
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <span>Acessar o Sistema</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="bg-[#F7F5FE] border-t border-[#EDE9FE] py-14 text-slate-600 text-xs">
        <div className="w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} Divisão de Tecnologia da Informação — UFC Campus Sobral.</span>
            <span>Sistema Soma de Almoxarifado</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
