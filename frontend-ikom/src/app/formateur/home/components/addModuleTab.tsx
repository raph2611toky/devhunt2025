"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addMod, useCourList } from "@/lib/services/formateur";
import { Video, FileText } from "lucide-react";
import { useAdminStore } from "@/lib/stores/cookies";
import { ListCourType } from "@/lib/api";

// Schéma de validation avec Zod
const addModuleSchema = z.object({
  cours: z
    .number({ required_error: "Veuillez sélectionner un cours" })
    .int("L'ID du cours doit être un entier"),
  titre: z.string().min(1, "Le titre est requis"),
  document: z.instanceof(File).optional().nullable(),
  video: z.instanceof(File).optional().nullable(),
  ordre: z
    .number({ required_error: "L'ordre est requis" })
    .int("L'ordre doit être un entier")
    .min(1, "L'ordre doit être supérieur à 0"),
});

// Type déduit du schéma
type AddModuleFormData = z.infer<typeof addModuleSchema>;

export default function AddModuleTab() {
  const [isLoading, setIsLoading] = useState(false);
  const { courList } = useCourList();
  const { admin, loadAdmin } = useAdminStore();

  useEffect(() => {
    if (!admin) {
      loadAdmin();
    }
  }, [admin, loadAdmin]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AddModuleFormData>({
    resolver: zodResolver(addModuleSchema),
    defaultValues: {
      cours: undefined,
      titre: "",
      document: null,
      video: null,
      ordre: 1,
    },
  });

  const onSubmit = async (data: AddModuleFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("cours", data.cours.toString());
      formData.append("titre", data.titre);
      if (data.document) formData.append("document", data.document);
      if (data.video) formData.append("video", data.video);
      formData.append("ordre", data.ordre.toString());

      // Appel API avec await pour attendre la réponse
      const response = await addMod(formData, admin?.access ?? "");
      console.log("Module ajouté avec succès :", response);
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (
    field: "document" | "video",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setValue(field, file, { shouldValidate: true });
  };

  return (
    <div className="bg-gray-200 border-2 border-black p-6">
      <h2 className="text-2xl font-extrabold text-black mb-4">
        AJOUTER UN MODULE
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Cours */}
        <div>
          <label className="block text-lg font-bold text-black">Cours *</label>
          <select
            className={`w-full p-3 text-lg bg-white border-2 border-black text-black focus:outline-none ${
              errors.cours ? "border-red-500" : ""
            }`}
            {...register("cours", { valueAsNumber: true })}
            disabled={isLoading} // Désactivé pendant le chargement
          >
            <option value="">Sélectionner un cours</option>
            {courList?.map((cours: ListCourType) => (
              <option key={cours.id} value={cours.id}>
                {cours.titre}
              </option>
            ))}
          </select>
          {errors.cours && (
            <p className="text-red-500 text-sm mt-1">{errors.cours.message}</p>
          )}
        </div>

        {/* Titre */}
        <div>
          <label className="block text-lg font-bold text-black">Titre *</label>
          <input
            type="text"
            placeholder="Titre du module"
            className={`w-full p-3 text-lg bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none ${
              errors.titre ? "border-red-500" : ""
            }`}
            {...register("titre")}
            disabled={isLoading} // Désactivé pendant le chargement
          />
          {errors.titre && (
            <p className="text-red-500 text-sm mt-1">{errors.titre.message}</p>
          )}
        </div>

        {/* Ordre */}
        <div>
          <label className="block text-lg font-bold text-black">Ordre *</label>
          <input
            type="number"
            placeholder="Ordre du module"
            className={`w-full p-3 text-lg bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none ${
              errors.ordre ? "border-red-500" : ""
            }`}
            {...register("ordre", { valueAsNumber: true })}
            disabled={isLoading} // Désactivé pendant le chargement
          />
          {errors.ordre && (
            <p className="text-red-500 text-sm mt-1">{errors.ordre.message}</p>
          )}
        </div>

        {/* Fichiers */}
        <div className="space-y-3">
          {/* Vidéo */}
          <div className="bg-yellow border-2 border-black p-4">
            <div className="flex items-center gap-3">
              <Video className="h-6 w-6 text-black" />
              <label className="flex-grow text-lg font-bold text-black">
                Vidéo :
                <input
                  type="file"
                  accept="video/*"
                  className={`text-sm ${errors.video ? "text-red-500" : ""}`}
                  onChange={(e) => handleFileChange("video", e)}
                  disabled={isLoading} // Désactivé pendant le chargement
                />
              </label>
            </div>
            {errors.video && (
              <p className="text-red-500 text-sm mt-1">
                {errors.video.message}
              </p>
            )}
          </div>

          {/* PDF */}
          <div className="bg-yellow border-2 border-black p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-black" />
              <label className="flex-grow text-lg font-bold text-black">
                PDF :
                <input
                  type="file"
                  accept=".pdf"
                  className={`text-sm ${errors.document ? "text-red-500" : ""}`}
                  onChange={(e) => handleFileChange("document", e)}
                  disabled={isLoading} // Désactivé pendant le chargement
                />
              </label>
            </div>
            {errors.document && (
              <p className="text-red-500 text-sm mt-1">
                {errors.document.message}
              </p>
            )}
          </div>
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
              Ajout en cours...
            </span>
          ) : (
            "Ajouter le module"
          )}
        </Button>
      </form>
    </div>
  );
}
