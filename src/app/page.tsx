import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowRightLeft, ClipboardCheck, Layers3, PackageCheck, PackageSearch } from 'lucide-react'
import { UfcLogo } from '@/shared/components/UfcLogo'
import { SomaLogo } from '@/shared/components/SomaLogo'

const recursos = [
  { icon: PackageSearch, title: 'Materiais organizados', text: 'Consulte o catálogo e encontre as informações dos materiais cadastrados.' },
  { icon: PackageCheck, title: 'Entradas e lotes', text: 'Registre o recebimento de materiais e acompanhe os dados de cada entrada.' },
  { icon: ArrowRightLeft, title: 'Transferências', text: 'Acompanhe a movimentação de materiais destinados aos setores.' },
  { icon: ClipboardCheck, title: 'Acompanhamento', text: 'Conte com auditorias e relatórios para apoiar a gestão do almoxarifado.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#171b32] selection:bg-violet-200">
      <header className="border-b border-[#e9e6ed]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Sistema Soma, página inicial" className="flex min-h-20 items-center gap-3">
            <SomaLogo /><span className="flex flex-col leading-tight"><span className="text-base font-bold tracking-tight">Sistema Soma</span><span className="mt-1 text-[11px] text-slate-500">Almoxarifado UFC Sobral</span></span>
          </Link>
          <nav aria-label="Navegação principal" className="order-3 flex w-full items-center gap-6 overflow-x-auto border-t border-[#e9e6ed] py-3 text-sm font-medium text-slate-600 md:order-none md:w-auto md:border-0 md:py-0">
            <a href="#sobre" className="whitespace-nowrap hover:text-violet-700">Sobre</a><a href="#recursos" className="whitespace-nowrap hover:text-violet-700">Recursos</a><Link href="/desenvolvedores" className="whitespace-nowrap hover:text-violet-700">Desenvolvedores</Link><Link href="/faq" className="whitespace-nowrap hover:text-violet-700">FAQ</Link>
          </nav>
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#6e35e8] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-violet-800 sm:px-5 sm:text-sm">Acessar sistema <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </header>
      <main>
        <section className="relative overflow-hidden border-b border-[#e9e6ed]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-100/60 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-12 lg:py-28">
            <div>
              <p className="mb-6 inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-700"><span className="h-2 w-2 rounded-full bg-violet-600" /> UFC Campus Sobral</p>
              <h1 className="max-w-2xl text-[2.8rem] font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[4.5rem]">Mais cuidado com cada <span className="text-[#713de0]">material.</span></h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">O Sistema Soma reúne as informações do almoxarifado para apoiar o controle de materiais e sua movimentação entre os setores da UFC Sobral.</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/login" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#6e35e8] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-colors hover:bg-violet-800">Acessar o sistema <ArrowRight size={17} aria-hidden="true" /></Link>
                <a href="#sobre" className="inline-flex items-center gap-2 px-3 py-4 text-sm font-semibold text-slate-700 hover:text-violet-700">Conheça o Soma <ArrowDown size={16} aria-hidden="true" /></a>
              </div>
              <div className="mt-12 flex items-center gap-3 border-t border-[#e6e2eb] pt-6 text-sm text-slate-500"><span className="h-8 w-1 rounded-full bg-violet-400" /> Desenvolvido para o dia a dia da UFC Sobral.</div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              <div aria-hidden="true" className="absolute -inset-3 rotate-3 rounded-[2rem] bg-[#eae4fa] sm:-inset-5" />
              <div className="relative rounded-[1.75rem] border border-white bg-white p-5 shadow-[0_25px_70px_-30px_rgba(51,30,97,0.35)] sm:p-7">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">Sistema Soma</p><p className="mt-2 text-xl font-semibold tracking-tight">Um olhar sobre o estoque</p></div><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600"><Layers3 size={21} aria-hidden="true" /></span></div>
                <p className="mt-5 text-sm leading-6 text-slate-500">Informações essenciais para acompanhar a rotina do almoxarifado.</p>
                <div className="mt-5 space-y-3">
                  {[{ icon: PackageSearch, title: 'Catálogo de materiais', text: 'Consulte os itens cadastrados' }, { icon: PackageCheck, title: 'Entradas de materiais', text: 'Registre os recebimentos' }, { icon: ArrowRightLeft, title: 'Transferências', text: 'Acompanhe as movimentações' }].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-[#faf9fc] p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm"><Icon size={19} aria-hidden="true" /></span><div className="min-w-0"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div><ArrowRight size={16} aria-hidden="true" className="ml-auto shrink-0 text-slate-400" /></div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-violet-400" /> Uma plataforma para a rotina do campus</div>
              </div>
            </div>
          </div>
        </section>
        <section id="sobre" className="scroll-mt-8 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-12">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Sobre o sistema</p><h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Do recebimento à entrega, tudo começa com organização.</h2><p className="mt-5 max-w-md text-base leading-7 text-slate-600">Criado para o almoxarifado da UFC Sobral, o Soma ajuda a reunir as informações necessárias para acompanhar os materiais e atender aos setores.</p></div>
            <div className="divide-y divide-slate-100 border-y border-slate-100">
              {[['01', 'Conheça os materiais', 'Consulte o catálogo e as informações dos itens cadastrados.'], ['02', 'Registre as entradas', 'Organize os dados de recebimento, materiais e lotes.'], ['03', 'Acompanhe as movimentações', 'Consulte as transferências e informações de apoio à gestão.']].map(([number, title, description]) => <div key={number} className="flex gap-5 py-6 sm:gap-8"><span className="pt-0.5 text-sm font-semibold text-violet-500">{number}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-500">{description}</p></div></div>)}
            </div>
          </div>
        </section>
        <section id="recursos" className="scroll-mt-8 bg-[#f5f3fa]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Recursos</p><h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">O que você pode fazer no Soma</h2></div><p className="max-w-sm text-sm leading-6 text-slate-600">Ferramentas para apoiar as diferentes etapas da gestão de materiais.</p></div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recursos.map(({ icon: Icon, title, text }, index) => <article key={title} className="flex min-h-56 flex-col rounded-2xl border border-[#e9e5f1] bg-white p-6"><div className="flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Icon size={21} aria-hidden="true" /></span><span className="text-xs font-semibold text-slate-400">0{index + 1}</span></div><h3 className="mt-7 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}
            </div>
          </div>
        </section>
        <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[1.75rem] bg-[#191630] p-8 text-white sm:p-12 md:flex-row md:items-center">
            <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Sistema Soma</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Acesse o almoxarifado.</h2><p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">Entre para consultar os materiais e acompanhar as atividades disponíveis para seu perfil.</p></div>
            <div className="flex flex-wrap items-center gap-4"><Link href="/login" className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-[#191630] hover:bg-violet-100">Acessar sistema <ArrowRight size={17} aria-hidden="true" /></Link><Link href="/faq" className="px-2 py-4 text-sm font-medium text-slate-300 hover:text-white">Dúvidas frequentes</Link></div>
          </div>
        </section>
      </main>
      <footer className="border-t border-[#e9e6ed]">
        <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12">
          <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.5fr]">
            <div><div className="flex items-center gap-3"><UfcLogo /><div><p className="font-bold">Sistema Soma</p><p className="mt-1 text-xs text-slate-500">Almoxarifado UFC Sobral</p></div></div><p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">Gestão de materiais para a Universidade Federal do Ceará, Campus Sobral.</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wider">Navegação</p><ul className="mt-5 space-y-3 text-sm text-slate-600"><li><a href="#sobre" className="hover:text-violet-700">Sobre</a></li><li><a href="#recursos" className="hover:text-violet-700">Recursos</a></li><li><Link href="/desenvolvedores" className="hover:text-violet-700">Desenvolvedores</Link></li><li><Link href="/faq" className="hover:text-violet-700">FAQ</Link></li></ul></div>
            <div><p className="text-xs font-bold uppercase tracking-wider">Institucional</p><p className="mt-5 text-sm leading-6 text-slate-600">Divisão de Tecnologia da Informação<br />Universidade Federal do Ceará<br />Campus Sobral</p></div>
          </div>
          <div className="flex flex-col justify-between gap-2 border-t border-[#e9e6ed] py-6 text-xs text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} DTI — UFC Campus Sobral.</span><span>Sistema Soma de Almoxarifado</span></div>
        </div>
      </footer>
    </div>
  )
}
