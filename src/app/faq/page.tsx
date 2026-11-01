'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UfcLogo } from '@/shared/components/UfcLogo'
import {
  ArrowRight,
  ChevronDown,
  Package,
  ArrowUpCircle,
  ArrowDownCircle,
  FileBarChart,
  Shield,
  Lock,
} from 'lucide-react'

const FAQ_ITEMS = [
  {
    icon: Package,
    category: 'Estoque e Materiais',
    question: 'Como consultar a disponibilidade de um material no estoque?',
    answer:
      'Ao acessar a plataforma, utilize a seção de "Materiais" no menu principal. É possível filtrar por nome do item, código interno, grupo de material ou localização para verificar o saldo disponível em tempo real.',
  },
  {
    icon: ArrowUpCircle,
    category: 'Requisições',
    question: 'Como solicitar uma saída ou transferência de material?',
    answer:
      'No menu "Transferências", clique no botão "Nova Transferência". Selecione o setor de destino, adicione os materiais desejados com as quantidades pretendidas e informe eventuais observações. A requisição será enviada para avaliação do almoxarifado.',
  },
  {
    icon: Shield,
    category: 'Permissões',
    question: 'Quem pode aprovar requisições e transferências?',
    answer:
      'Usuários com perfil de Gerente (MANAGER) ou Administrador (ADMIN) têm permissão para analisar, aprovar ou reprovar as solicitações de materiais emitidas pelos setores da UFC.',
  },
  {
    icon: ArrowDownCircle,
    category: 'Entradas de Estoque',
    question: 'Como é feito o registro de entrada de novos materiais?',
    answer:
      'Almoxarifes e administradores cadastram as novas entradas vinculadas ao número da Nota Fiscal, fornecedor e lotes recebidos, garantindo controle de validade pelo método FIFO (primeiro que entra, primeiro que sai).',
  },
  {
    icon: FileBarChart,
    category: 'Relatórios e Auditorias',
    question: 'Quais relatórios o sistema disponibiliza?',
    answer:
      'A plataforma oferece relatórios de Relação Geral de Itens, Materiais com Estoque Baixo, Controle de Validade/Lotes, Histórico de Entradas, Transferências e Auditorias Físicas periódicas.',
  },
  {
    icon: Lock,
    category: 'Acesso e Contas',
    question: 'Como funciona o acesso institucional ao sistema?',
    answer:
      'O acesso é restrito a servidores e colaboradores cadastrados com e-mail institucional da UFC Sobral. Caso tenha esquecido sua senha, utilize a opção "Esqueci minha senha" na tela de login para receber as instruções.',
  },
]

export default function PublicFAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
            <Link href="/desenvolvedores" className="hover:text-[#7C3AED] transition-colors">
              Desenvolvedores
            </Link>
            <span className="text-[#7C3AED] font-semibold">
              FAQ
            </span>
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
        <section className="w-full max-w-[1440px] mx-auto px-8 sm:px-14 lg:px-20 xl:px-24 pt-12 pb-20 text-center">
          <span className="inline-block text-xs uppercase tracking-widest font-bold text-[#7C3AED] bg-[#EDE9FE] px-4 py-1.5 rounded-full mb-4">
            Central de Ajuda
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-slate-950 tracking-tight leading-[1.1] mb-5">
            Perguntas Frequentes
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Tire suas dúvidas sobre o funcionamento do Sistema Soma e os fluxos de almoxarifado da UFC Sobral.
          </p>
        </section>
      </div>

      {/* 2. FAQ Accordion List */}
      <main className="flex-1 py-16 sm:py-24 bg-white">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-8">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index
              const Icon = item.icon

              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'border-[#DDD6FE] bg-[#FAF8FF] shadow-xs'
                      : 'border-slate-100 bg-white hover:border-[#EDE9FE]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isOpen ? 'bg-[#EDE9FE] text-[#7C3AED]' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.75} />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                          {item.category}
                        </span>
                        <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                          {item.question}
                        </h2>
                      </div>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#7C3AED] bg-[#EDE9FE]' : 'text-slate-400 bg-slate-50'
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 ml-14 text-sm text-slate-600 leading-relaxed border-t border-[#EDE9FE]/50 mt-2">
                      <p className="pt-4">{item.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
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
