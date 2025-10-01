import { z } from "zod";

export const alunoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(80, "Nome deve ter no máximo 80 caracteres"),
  matricula: z
    .string()
    .trim()
    .min(3, "Matrícula deve ter no mínimo 3 caracteres")
    .max(20, "Matrícula deve ter no máximo 20 caracteres"),
  data_nascimento: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Data de nascimento inválida"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  telefone: z.string().trim().optional().or(z.literal("")),
  turma: z.string().trim().optional().or(z.literal("")),
});

export type AlunoFormData = z.infer<typeof alunoSchema>;
