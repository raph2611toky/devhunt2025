"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addCour } from "@/lib/services/formateur";
import { useAdminStore } from "@/lib/stores/cookies";

// Schéma de validation avec Zod
const addCourseSchema = z.object({
  titre: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre ne doit pas dépasser 200 caractères"),
  description: z.string().min(1, "La description est requise"),
  domaine: z.enum(["PROG", "LANG", "SCI", "MATH"], {
    errorMap: () => ({ message: "Veuillez sélectionner un domaine valide" }),
  }),
  status: z.enum(["Pend", "Publ"], {
    errorMap: () => ({ message: "Veuillez sélectionner un statut valide" }),
  }),
});

// Type déduit du schéma
type AddCourseFormData = z.infer<typeof addCourseSchema>;

export default function AddCourseTab() {
  const [isLoading, setIsLoading] = useState(false);

  const { admin, loadAdmin } = useAdminStore();

  // Charger les données admin si elles ne sont pas présentes
  useEffect(() => {
    if (!admin) {
      loadAdmin();
    }
  }, [admin, loadAdmin]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCourseFormData>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      titre: "",
      description: "",
      domaine: "PROG", // Valeur par défaut cohérente avec l'enum
      status: "Pend", // Valeur par défaut cohérente avec l'enum
    },
  });

  // Gestion de la soumission
  const onSubmit = async (data: AddCourseFormData) => {
    setIsLoading(true);
    try {
      const response = await addCour(
        data.titre,
        data.description,
        data.domaine,
        data.status,
        admin?.access ?? ""
      );
      console.log("Réponse de l'API :", response);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 border-2 border-black p-6">
      <h2 className="text-2xl font-extrabold text-black mb-4">
        AJOUTER UN COURS
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Titre */}
        <div>
          <label className="block text-lg font-bold text-black">Titre *</label>
          <input
            type="text"
            placeholder="Titre du cours"
            className={`w-full p-3 text-lg bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none ${
              errors.titre ? "border-red-500" : ""
            }`}
            {...register("titre")}
            disabled={isLoading}
          />
          {errors.titre && (
            <p className="text-red-500 text-sm mt-1">{errors.titre.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-bold text-black">
            Description *
          </label>
          <textarea
            placeholder="Description du cours"
            className={`w-full p-3 text-lg bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none ${
              errors.description ? "border-red-500" : ""
            }`}
            {...register("description")}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Domaine */}
        <div>
          <label className="block text-lg font-bold text-black">Domaine</label>
          <select
            className={`w-full p-3 text-lg bg-white border-2 border-black text-black focus:outline-none ${
              errors.domaine ? "border-red-500" : ""
            }`}
            {...register("domaine")}
            disabled={isLoading}>
            <option value="PROG">Catégorie : Programation</option>
            <option value="MATH">Mathématique</option>
            <option value="SCI">Sciences</option>
            <option value="LANG">Langues</option>
          </select>
          {errors.domaine && (
            <p className="text-red-500 text-sm mt-1">
              {errors.domaine.message}
            </p>
          )}
        </div>

        {/* Statut */}
        <div>
          <label className="block text-lg font-bold text-black">Statut</label>
          <select
            className={`w-full p-3 text-lg bg-white border-2 border-black text-black focus:outline-none ${
              errors.status ? "border-red-500" : ""
            }`}
            {...register("status")}
            disabled={isLoading}>
            <option value="Pend">Pending</option>
            <option value="Publ">Publier</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Bouton de soumission avec loader */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform disabled:opacity-50"
          disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                />
              </svg>
              Création en cours...
            </span>
          ) : (
            "Créer le cours"
          )}
        </Button>
      </form>
    </div>
  );
}
