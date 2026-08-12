export type AuditStatus = 'IN_PROGRESS' | 'FINALIZED' | 'CANCELED'
export type ExpirationType = 'DATED' | 'NON_EXPIRING' | 'INDEFINITE'

export interface Auditor {
  id: string
  name: string
}

export interface MaterialAuditItem {
  id: string
  materialId: string
  materialName: string
  expirationType: ExpirationType
  expirationDate: string | null
  systemQuantity: number
  physicalQuantity: number
  difference: number
}

export interface MaterialAudit {
  id: string
  status: AuditStatus
  createdAt: string
  finishedAt: string | null
}

export interface MaterialAuditDetails extends MaterialAudit {
  auditors: Auditor[]
  items: MaterialAuditItem[]
}

export interface CreateMaterialAuditPayload {
  materialIds: string[]
  auditorIds?: string[]
}

export interface MaterialAuditItemUpdatePayload {
  itemId: string
  physicalQuantity: number
}

export interface UpdateMaterialAuditItemsPayload {
  items: MaterialAuditItemUpdatePayload[]
}

export interface AddAuditorsPayload {
  auditorIds: string[]
}
