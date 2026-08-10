import { z } from "zod";

export const contractSchema = z.object({
  referenceNumber: z.string().min(1, "Número de referência é obrigatório"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  status: z.boolean(),
  companyName: z.string().min(1, "Empresa é obrigatória"),
  userIds: z.array(z.string().uuid("Usuário selecionado inválido")).min(1, "Selecione pelo menos um usuário"),
});

export type ContractFormData = z.infer<typeof contractSchema>;
