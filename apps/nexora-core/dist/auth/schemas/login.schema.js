"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .trim()
        .email("Email inválido")
        .max(255, "Email muito longo")
        .transform((value) => value.toLowerCase()),
    password: zod_1.z
        .string()
        .min(1, "Senha obrigatória")
        .max(72, "Senha muito longa"),
});
//# sourceMappingURL=login.schema.js.map