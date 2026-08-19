import { Metadata } from 'next'
import { CompaniesList } from '@/features/companies/components/CompaniesList'

export const metadata: Metadata = {
  title: 'Empresas | Almoxarifado UFC',
  description: 'Gerenciamento de empresas e órgãos',
}

export default function CompaniesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CompaniesList />
    </div>
  )
}
