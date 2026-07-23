import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  FlaskConical,
  Wrench,
  Monitor,
  BookOpen,
  GraduationCap,
  Briefcase,
  Archive,
  Warehouse,
  Heart,
  type LucideIcon,
} from 'lucide-react'

// 3-color system: purple · amber · slate
export const ic = {
  brand: { icon: 'text-brand', bg: 'bg-violet-50' },
  amber: { icon: 'text-amber-500', bg: 'bg-amber-50' },
  slate: { icon: 'text-slate-400', bg: 'bg-slate-100' },
} as const

export type StatusConfig = {
  Icon: LucideIcon
  label: string
  iconColor: string
  bg: string
}

export const ENTRY_STATUS: Record<string, StatusConfig> = {
  PENDING:  { Icon: Clock,         label: 'Pendente',   iconColor: ic.amber.icon, bg: ic.amber.bg },
  FINISHED: { Icon: CheckCircle2,  label: 'Finalizada', iconColor: ic.brand.icon, bg: ic.brand.bg },
  CANCELED: { Icon: XCircle,       label: 'Cancelada',  iconColor: ic.slate.icon, bg: ic.slate.bg },
}

export const TRANSFER_STATUS: Record<string, StatusConfig> = {
  PENDING:            { Icon: Clock,         label: 'Pendente',  iconColor: ic.amber.icon, bg: ic.amber.bg },
  APPROVED:           { Icon: CheckCircle2,  label: 'Aprovada',  iconColor: ic.brand.icon, bg: ic.brand.bg },
  PARTIALLY_APPROVED: { Icon: AlertTriangle, label: 'Parcial',   iconColor: ic.amber.icon, bg: ic.amber.bg },
  DENIED:             { Icon: XCircle,       label: 'Negada',    iconColor: ic.slate.icon, bg: ic.slate.bg },
  CANCELED:           { Icon: XCircle,       label: 'Cancelada', iconColor: ic.slate.icon, bg: ic.slate.bg },
}

const SECTOR_ICON_SET: LucideIcon[] = [
  Building2, FlaskConical, Wrench, Monitor,
  BookOpen, GraduationCap, Briefcase, Archive,
  Warehouse, Heart,
]

export function getSectorIcon(id: string | number): LucideIcon {
  const hash = typeof id === 'string'
    ? id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    : id
  return SECTOR_ICON_SET[Math.abs(hash) % SECTOR_ICON_SET.length]
}
