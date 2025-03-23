"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ArrowLeft, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/lib/services/formateur";

// Schéma de validation avec Zod pour email et password
const loginSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// Type déduit du schéma
type LoginFormData = z.infer<typeof loginSchema>;

export default function Page() {
  const [loginMethod, setLoginMethod] = useState<"credentials" | "facial">(
    "credentials"
  );
  const [loading, setLoading] = useState(false); // État de chargement

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      console.log("Connexion réussie");
      window.location.href = "/formateur/home";
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-white mb-6 hover:text-yellow transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="bg-light-grey border-2 border-soft-black p-6 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black text-soft-black">LOGIN</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setLoginMethod("credentials")}
                className={`p-2 rounded ${
                  loginMethod === "credentials"
                    ? "bg-yellow border-2 border-soft-black"
                    : "bg-soft-grey"
                }`}>
                <User className="h-5 w-5 text-soft-black" />
              </button>
              <button
                onClick={() => setLoginMethod("facial")}
                className={`p-2 rounded ${
                  loginMethod === "facial"
                    ? "bg-yellow border-2 border-soft-black"
                    : "bg-soft-grey"
                }`}>
                <Camera className="h-5 w-5 text-soft-black" />
              </button>
            </div>
          </div>

          {loginMethod === "credentials" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-soft-black font-bold">Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 h-12 border-2 border-soft-black focus:ring-yellow ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    {...register("email")}
                    disabled={loading} // Désactiver pendant le chargement
                  />
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-grey" />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-soft-black font-bold">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className={`pl-10 h-12 border-2 border-soft-black focus:ring-yellow ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    {...register("password")}
                    disabled={loading} // Désactiver pendant le chargement
                  />
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-grey" />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full h-12 bg-yellow hover:bg-yellow/90 text-soft-black font-bold border-2 border-soft-black rounded-md transition-transform hover:-translate-y-1 disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-soft-black"
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
                    Connexion...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center text-soft-black">
              <p>Mode reconnaissance faciale (non implémenté ici)</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t-2 border-soft-grey text-center">
            <p className="text-soft-black">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue font-bold hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
