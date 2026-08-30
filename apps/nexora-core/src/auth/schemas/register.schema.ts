import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(32, "Username deve ter no máximo 32 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username pode conter apenas letras, números e _",
    ),

  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email muito longo")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .max(72, "Senha muito longa"),
});

export type RegisterInput = z.infer<typeof registerSchema>;