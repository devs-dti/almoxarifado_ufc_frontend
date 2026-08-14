import { AuditDetails } from '@/features/material-audits/components/AuditDetails'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AuditoriaDetailsPage({ params }: Props) {
  const { id } = await params
  
  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-300">
      <AuditDetails id={id} />
    </div>
  )
}
