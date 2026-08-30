import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    username: z.ZodString;
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strip>;
export type RegisterInput = z.infer<typeof registerSchema>;
