import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, "Senha obrigatória")
    .max(72, "Senha muito longa"),
});

export type LoginInput = z.infer<typeof loginSchema>;