export interface Company {
  id: string; // UUID
  sei: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export type CompanyDTO = Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
