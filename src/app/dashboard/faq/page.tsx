import type { Metadata } from 'next'
import { HelpCircle, Package, ArrowDownCircle, ArrowUpCircle, FileBarChart, Shield, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ / Perguntas Frequentes — Almoxarifado UFC',
  description: 'Dúvidas frequentes e guia de uso do Sistema Soma Almoxarifado UFC',
}

const FAQ_ITEMS = [
  {
    icon: Package,
    question: 'Como consultar a disponibilidade de um material no estoque?',
    answer:
      'Acesse o menu "Materiais" na barra lateral. Você pode filtrar por nome, código interno, grupo ou localização física para verificar a quantidade disponível em tempo real.',
  },
  {
    icon: ArrowUpCircle,
    question: 'Como solicitar uma saída ou transferência de material?',
    answer:
      'Acesse a página "Transferências", clique no botão "Nova" e selecione o tipo de saída, o setor solicitante e os materiais desejados com suas respectivas quantidades.',
  },
  {
    icon: ArrowDownCircle,
    question: 'Como cadastrar a entrada de novos itens ou notas fiscais?',
    answer:
      'No menu "Entradas", clique em "Nova Entrada", informe o número da Nota Fiscal, fornecedor e adicione os lotes e materiais recebidos.',
  },
  {
    icon: FileBarChart,
    question: 'Como gerar relatórios de movimentação e estoque baixo?',
    answer:
      'Acesse "Relatórios" na barra lateral e escolha entre Relação Geral de Itens, Estoque Baixo, Controle de Vencimentos, Histórico de Entradas ou Saídas.',
  },
  {
    icon: Lock,
    question: 'Como redefinir minha senha de acesso?',
    answer:
      'Na página de login ou na tela "Meu Perfil", clique em "Solicitar Redefinição de Senha" para receber o link de recuperação no seu e-mail cadastrado.',
  },
  {
    icon: Shield,
    question: 'Quem pode aprovar requisições e transferências?',
    answer:
      'Usuários com perfil de Gerente (MANAGER) ou Administrador (ADMIN) têm permissão para analisar e aprovar as quantidades requisitadas pelos setores.',
  },
]

export default function FAQPage() {
  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1">
          <span>Início</span>
          <span>/</span>
          <span className="text-gray-600">Perguntas Frequentes</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
          <HelpCircle className="text-brand" size={28} />
          Perguntas Frequentes (FAQ)
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Confira as respostas para as dúvidas mais comuns sobre o funcionamento do Sistema Soma Almoxarifado UFC.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={18} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-sm font-bold text-gray-900">{item.question}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
