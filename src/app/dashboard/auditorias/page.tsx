import { MaterialAuditList } from '@/features/material-audits/components/MaterialAuditList'

export default function AuditoriasPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-in fade-in duration-300">
      <MaterialAuditList />
    </div>
  )
}
