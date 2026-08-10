
export interface Contract {
  id: string; // UUID
  referenceNumber: string;
  startDate: string;
  endDate: string;
  status: boolean; // true = Ativo, false = Inativo
  companyName: string; // Nome da Empresa retornado do backend
  userIds: string[]; // UUIDs dos usuários
  users?: { id: string; name: string }[]; // Populated by backend
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export type ContractDTO = Omit<Contract, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'users' | 'companyName'> & {
  companyId: string;
};
