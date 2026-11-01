'use client'

import Link from 'next/link'
import Image from 'next/image'
import { UfcLogo } from '@/shared/components/UfcLogo'
import {
  ArrowRight,
  Layers,
  Clock,
  ShieldCheck,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#7C3AED] selection:text-white">
      {/* 1. Full-Height Hero Container with Soft Brand Purple */}
      <div className="min-h-screen bg-[#F7F5FE] border-b border-[#EDE9FE] flex flex-col justify-between">
        {/* Header / Navbar */}
        <header className="w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24 h-20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <UfcLogo />
            <div className="flex flex-col leading-tight"><span className="font-bold text-lg text-slate-900 tracking-tight">Sistema Soma</span><span className="text-[11px] text-slate-500 font-medium">Almoxarifado UFC Sobral</span></div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#sobre" className="hover:text-[#7C3AED] transition-colors">
              Sobre
            </a>
            <a href="#recursos" className="hover:text-[#7C3AED] transition-colors">
              Recursos
            </a>
            <Link href="/desenvolvedores" className="hover:text-[#7C3AED] transition-colors">
              Desenvolvedores
            </Link>
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

        {/* Hero Section (Symmetrical Lateral Margins) */}
        <section className="flex-1 flex items-center justify-center w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24 py-6 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
            {/* Left Column (Big Typography + Action Button) */}
            <div className="lg:col-span-6 space-y-6 lg:space-y-8 flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[70px] font-serif font-normal text-slate-950 tracking-tight leading-[1.06]">
                Gestão Ágil <br />
                de materiais e <br className="hidden xl:inline" />
                almoxarifado
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-lg">
                A forma simples, eficiente e transparente <br className="hidden sm:inline" />
                de controlar o estoque e solicitar materiais para o seu setor.
              </p>

              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-sm transition-all shadow-lg shadow-[#7C3AED]/25 hover:shadow-xl hover:shadow-[#7C3AED]/30"
                >
                  <span>Acessar com Conta Institucional</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Column (Large Illustration aligned with Heading top) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end items-center w-full">
              <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-[380px] sm:h-[480px] lg:h-[520px] xl:h-[560px] relative flex items-center justify-center -translate-y-8 sm:-translate-y-12 lg:-translate-y-16 xl:-translate-y-20">
                <Image
                  src="/almoxarifado-hero.png"
                  alt="Ilustração do Almoxarifado UFC Sobral"
                  fill
                  className="object-contain object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Bottom Bar on Hero */}
        <div className="w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24 pb-6 text-center text-[11px] text-slate-400 font-medium shrink-0">
          <span>Divisão de Tecnologia da Informação — UFC Campus Sobral</span>
        </div>
      </div>

      {/* 2. Middle Section (Why Sistema Soma) */}
      <section id="recursos" className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 text-center">
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-slate-950 mb-20 tracking-tight">
            Por que o Sistema Soma?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-8 rounded-3xl bg-[#FAF8FF] border border-[#EDE9FE]/80 hover:border-[#DDD6FE] transition-colors shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] mb-6">
                <Layers size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">Controle Unificado</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Consulta de saldo em tempo real, controle de validade por lote (FIFO) e catálogo padronizado de materiais.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center p-8 rounded-3xl bg-[#FAF8FF] border border-[#EDE9FE]/80 hover:border-[#DDD6FE] transition-colors shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] mb-6">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">Suporte e Agilidade</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Processo simplificado de pedidos para os setores solicitantes, com aprovação rápida e transparente.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-8 rounded-3xl bg-[#FAF8FF] border border-[#EDE9FE]/80 hover:border-[#DDD6FE] transition-colors shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] mb-6">
                <Clock size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-3">Economia de Tempo</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Rastreabilidade instantânea de lotes, auditorias físicas periódicas e relatórios operacionais sem retrabalho.
              </p>
            </div>
          </div>

          {/* Statement */}
          <div className="pt-28 max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-serif font-normal text-slate-950 tracking-tight leading-snug mb-4">
              Uma plataforma única e eficiente para atender todas as necessidades de materiais da UFC Sobral.
            </h3>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Desenvolvida para conectar almoxarifes, gerentes e colaboradores em um fluxo contínuo.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Dark CTA Card */}
      <section className="pb-24 sm:pb-32 px-6 sm:px-12 lg:px-16 xl:px-20 bg-white">
        <div className="max-w-[1600px] mx-auto bg-slate-950 rounded-[32px] p-8 sm:p-16 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
              Veja o almoxarifado em ação
            </h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Acesse a plataforma com seu e-mail institucional para solicitar e acompanhar materiais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm transition-all shadow-md"
            >
              <span>Acessar o Sistema</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              <span>Perguntas Frequentes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Footer (Soft Purple Matching the Header) */}
      <footer className="bg-[#F7F5FE] border-t border-[#EDE9FE] py-16 text-slate-600 text-xs">
        <div className="w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
            <div className="space-y-3 md:col-span-1">
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base text-slate-900 tracking-tight">Sistema Soma</span>
                <span className="text-[10px] text-slate-500 font-medium">Almoxarifado UFC Sobral</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gestão de suprimentos e almoxarifado da Universidade Federal do Ceará — Campus Sobral.
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-4">Navegação</span>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="#sobre" className="hover:text-[#7C3AED] transition-colors">Sobre</a></li>
                <li><a href="#recursos" className="hover:text-[#7C3AED] transition-colors">Recursos</a></li>
                <li><Link href="/desenvolvedores" className="hover:text-[#7C3AED] transition-colors">Desenvolvedores</Link></li>
                <li><Link href="/faq" className="hover:text-[#7C3AED] transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-4">Institucional</span>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><span>Divisão de Tecnologia da Informação (DTI)</span></li>
                <li><span>Campus da UFC em Sobral</span></li>
                <li><span>Universidade Federal do Ceará</span></li>
              </ul>
            </div>

            <div>
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-4">Acesso</span>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Acesse com seu e-mail institucional cadastrado.
              </p>
              <Link
                href="/login"
                className="inline-block px-5 py-2.5 rounded-full bg-[#7C3AED] text-white font-semibold text-xs hover:bg-[#6D28D9] transition-all shadow-xs"
              >
                Portal de Acesso
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-[#EDE9FE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} Divisão de Tecnologia da Informação — UFC Campus Sobral.</span>
            <span>Sistema Soma de Almoxarifado</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
