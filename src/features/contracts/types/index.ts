export interface Contract {
  id: string
  referenceNumber: string
  startDate: string
  endDate: string
  status: boolean
  companyName: string
}

export interface ContractDetail extends Omit<Contract, 'companyName'> {
  company: { id: string; name: string }
  users: { id: string; name: string; cpf?: string; jobTitle?: string }[]
  updatedAt?: string
}

export type ContractDTO = {
  referenceNumber: string
  startDate: string
  endDate: string
  status: boolean
  companyId: string
  userIds: string[]
}
