"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .trim()
        .min(3, "Username deve ter pelo menos 3 caracteres")
        .max(32, "Username deve ter no máximo 32 caracteres")
        .regex(/^[a-zA-Z0-9_]+$/, "Username pode conter apenas letras, números e _"),
    email: zod_1.z
        .string()
        .trim()
        .email("Email inválido")
        .max(255, "Email muito longo")
        .transform((value) => value.toLowerCase()),
    password: zod_1.z
        .string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .max(72, "Senha muito longa"),
});
//# sourceMappingURL=register.schema.js.map