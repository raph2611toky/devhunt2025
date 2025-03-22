import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Adresse email invalide")
    .nonempty("L'email est requis"),
  sexe: z
    .enum(["M", "F", "I"], {
      errorMap: () => ({ message: "Le sexe doit être M, F ou I" }),
    })
    .default("I"),
  handicap_type: z
    .enum(["AVEUGLE", "SOURD", "MUTILE_INF", "MUTILE_SUP", "MUET", "AUTRES"], {
      errorMap: () => ({
        message: "Type de handicap invalide",
      }),
    })
    .default("AUTRES"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
