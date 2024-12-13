import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email obligatorio" })
      .email({ message: "Email inválido" }),
    name: z
      .string()
      .min(3, { message: "El nombre debe tener mínimo 3 caracteres" }),
    password: z
      .string()
      .min(5, { message: "La contraseña debe tener mínimo 5 caracteres" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Las contraseñas no coinciden",
    path: ["password_confirmation"],
  });
