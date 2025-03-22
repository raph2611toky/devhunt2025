"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Video,
  FileText,
  Clock,
  Plus,
  List,
  LogOut,
  Upload,
} from "lucide-react";

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState("liste-cours");

  const renderContent = () => {
    switch (activeTab) {
      case "historique":
        return (
          <div className="bg-gray-200 border-2 border-black p-6">
            <h2 className="text-2xl font-extrabold text-black mb-4">
              HISTORIQUE DES ACTIONS
            </h2>
            <div className="space-y-4">
              <div className="bg-white border-2 border-black p-4">
                <p className="text-lg font-bold text-black">
                  Cours "Utiliser un PC" publié
                </p>
                <p className="text-sm font-bold text-black">
                  22/03/2025 - 14:32
                </p>
              </div>
              <div className="bg-white border-2 border-black p-4">
                <p className="text-lg font-bold text-black">
                  Module ajouté à "Cuisine de base"
                </p>
                <p className="text-sm font-bold text-black">
                  20/03/2025 - 09:15
                </p>
              </div>
            </div>
          </div>
        );
      case "ajout-cours":
        return (
          <div className="bg-gray-200 border-2 border-black p-6">
            <h2 className="text-2xl font-extrabold text-black mb-4">
              AJOUTER UN COURS
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Titre du cours"
                className="w-full p-3 text-lg bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none"
              />
              <select className="w-full p-3 text-lg bg-white border-2 border-black text-black focus:outline-none">
                <option>Catégorie : Informatique</option>
                <option>Langues</option>
                <option>Métiers</option>
                <option>Loisirs</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2 bg-white border-2 border-black cursor-pointer hover:bg-yellow transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-black border-2 border-black"
                  />
                  <span className="text-lg font-bold text-black">Visuel</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white border-2 border-black cursor-pointer hover:bg-yellow transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-black border-2 border-black"
                  />
                  <span className="text-lg font-bold text-black">Auditif</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white border-2 border-black cursor-pointer hover:bg-yellow transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-black border-2 border-black"
                  />
                  <span className="text-lg font-bold text-black">Moteur</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white border-2 border-black cursor-pointer hover:bg-yellow transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-black border-2 border-black"
                  />
                  <span className="text-lg font-bold text-black">Cognitif</span>
                </label>
              </div>
              <Button
                size="lg"
                className="w-full bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
                Créer le cours
              </Button>
            </div>
          </div>
        );
      case "liste-cours":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-200 border-2 border-black p-6">
              <h2 className="text-2xl font-extrabold text-black mb-4">
                BROUILLONS
              </h2>
              <div className="space-y-4">
                <div className="bg-white border-2 border-black p-4 hover:bg-yellow transition-colors">
                  <p className="text-lg font-bold text-black">
                    Apprendre à coder
                  </p>
                  <p className="text-sm font-bold text-black">3 modules</p>
                  <Button
                    size="sm"
                    className="mt-2 bg-black hover:bg-gray-800 text-yellow font-bold border-2 border-yellow hover:-translate-y-1 transition-transform">
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 border-2 border-black p-6">
              <h2 className="text-2xl font-extrabold text-black mb-4">
                COURS PUBLIÉS
              </h2>
              <div className="space-y-4">
                <div className="bg-white border-2 border-black p-4 hover:bg-yellow transition-colors">
                  <p className="text-lg font-bold text-black">Utiliser un PC</p>
                  <p className="text-sm font-bold text-black">12 étudiants</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "ajout-module":
        return (
          <div className="bg-gray-200 border-2 border-black p-6">
            <h2 className="text-2xl font-extrabold text-black mb-4">
              AJOUTER UN MODULE
            </h2>
            <div className="space-y-4">
              <select className="w-full p-3 text-lg bg-white border-2 border-black text-black focus:outline-none">
                <option>Sélectionner un cours</option>
                <option>Utiliser un PC</option>
                <option>Apprendre à coder</option>
              </select>
              <input
                type="text"
                placeholder="Titre du module"
                className="w-full p-3 text-lg bg-white border-2 border-black text-black placeholder-gray-500 focus:outline-none"
              />
              <div className="space-y-3">
                <div className="bg-yellow border-2 border-black p-4">
                  <div className="flex items-center gap-3">
                    <Video className="h-6 w-6 text-black" />
                    <label className="flex-grow text-lg font-bold text-black">
                      Vidéo :{" "}
                      <input type="file" accept="video/*" className="text-sm" />
                    </label>
                  </div>
                </div>
                <div className="bg-yellow border-2 border-black p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-black" />
                    <label className="flex-grow text-lg font-bold text-black">
                      PDF :{" "}
                      <input type="file" accept=".pdf" className="text-sm" />
                    </label>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
                Ajouter le module
              </Button>
            </div>
          </div>
        );
      case "deconnexion":
        return (
          <div className="bg-black border-2 border-yellow p-6 text-center">
            <h2 className="text-2xl font-extrabold text-yellow mb-4">
              DÉCONNEXION
            </h2>
            <p className="text-lg font-bold text-yellow mb-6">
              Voulez-vous vraiment vous déconnecter ?
            </p>
            <Button
              size="lg"
              className="bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
              Confirmer la déconnexion
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gray-100 border-[.15rem] border-black p-6">
        {/* En-tête */}
        <header className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <Button className="inline-flex items-center bg-yellow hover:bg-yellow/80 text-black font-bold border-2 border-black hover:-translate-y-1 transition-transform">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-black">
              TABLEAU DE BORD - FORMATEUR
            </h1>
          </div>

          {/* Onglets de navigation */}
          <div className="bg-white border-2 border-black p-2 flex flex-wrap gap-2 justify-center">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-bold text-black hover:bg-yellow transition-colors ${
                activeTab === "liste-cours" ? "bg-yellow" : ""
              }`}
              onClick={() => setActiveTab("liste-cours")}>
              <List className="h-5 w-5" />
              Liste des cours
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-bold text-black hover:bg-yellow transition-colors ${
                activeTab === "ajout-cours" ? "bg-yellow" : ""
              }`}
              onClick={() => setActiveTab("ajout-cours")}>
              <Plus className="h-5 w-5" />
              Ajouter un cours
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-bold text-black hover:bg-yellow transition-colors ${
                activeTab === "ajout-module" ? "bg-yellow" : ""
              }`}
              onClick={() => setActiveTab("ajout-module")}>
              <Upload className="h-5 w-5" />
              Ajouter un module
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-bold text-black hover:bg-yellow transition-colors ${
                activeTab === "historique" ? "bg-yellow" : ""
              }`}
              onClick={() => setActiveTab("historique")}>
              <Clock className="h-5 w-5" />
              Historique
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-bold text-black hover:bg-yellow transition-colors ${
                activeTab === "deconnexion" ? "bg-yellow" : ""
              }`}
              onClick={() => setActiveTab("deconnexion")}>
              <LogOut className="h-5 w-5" />
              Déconnexion
            </Button>
          </div>
        </header>

        {/* Contenu principal */}
        <div className="pb-16">{renderContent()}</div>
      </div>
    </div>
  );
}
