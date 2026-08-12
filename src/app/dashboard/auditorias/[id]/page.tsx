import { AuditDetails } from '@/features/material-audits/components/AuditDetails'

interface Props {
  params: { id: string }
}

export default function AuditoriaDetailsPage({ params }: Props) {
  return (
    <div className="flex-1 p-4 md:p-8 pt-6 animate-in fade-in duration-300">
      <AuditDetails id={params.id} />
    </div>
  )
}
