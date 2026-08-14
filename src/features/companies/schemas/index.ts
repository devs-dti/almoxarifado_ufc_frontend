import { z } from "zod";

export const companySchema = z.object({
  sei: z.string().min(1, "O código SEI é obrigatório"),
  name: z.string().min(1, "O nome da empresa é obrigatório"),
});

export type CompanyFormData = z.infer<typeof companySchema>;
