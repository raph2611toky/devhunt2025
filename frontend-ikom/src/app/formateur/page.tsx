"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Video,
  FileText,
  HelpCircle,
  BookOpen,
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
          <div className="bg-blue/10 rounded-3xl p-6">
            <h2 className="text-2xl font-extrabold text-soft-black mb-4 tracking-tight">
              Historique des actions
            </h2>
            <div className="space-y-4">
              <div className="bg-white/95 p-4 rounded-xl">
                <p className="text-lg font-medium text-soft-black">
                  Cours "Utiliser un PC" publié
                </p>
                <p className="text-sm text-grey">22/03/2025 - 14:32</p>
              </div>
              <div className="bg-white/95 p-4 rounded-xl">
                <p className="text-lg font-medium text-soft-black">
                  Module ajouté à "Cuisine de base"
                </p>
                <p className="text-sm text-grey">20/03/2025 - 09:15</p>
              </div>
            </div>
          </div>
        );
      case "ajout-cours":
        return (
          <div className="bg-blue/10 rounded-3xl p-6">
            <h2 className="text-2xl font-extrabold text-soft-black mb-4 tracking-tight">
              Ajouter un cours
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Titre du cours"
                className="w-full p-3 text-lg bg-white/95 rounded-xl text-soft-black placeholder-grey focus:ring-2 focus:ring-blue/50 focus:outline-none transition-all duration-300"
              />
              <select className="w-full p-3 text-lg bg-white/95 rounded-xl text-soft-black focus:ring-2 focus:ring-blue/50 focus:outline-none transition-all duration-300">
                <option>Catégorie : Informatique</option>
                <option>Langues</option>
                <option>Métiers</option>
                <option>Loisirs</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2 bg-blue/20 rounded-xl cursor-pointer hover:bg-blue/30 transition-all duration-300">
                  <input type="checkbox" className="w-5 h-5 accent-yellow" />
                  <span className="text-lg font-medium text-soft-black">
                    Visuel
                  </span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-blue/20 rounded-xl cursor-pointer hover:bg-blue/30 transition-all duration-300">
                  <input type="checkbox" className="w-5 h-5 accent-yellow" />
                  <span className="text-lg font-medium text-soft-black">
                    Auditif
                  </span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-blue/20 rounded-xl cursor-pointer hover:bg-blue/30 transition-all duration-300">
                  <input type="checkbox" className="w-5 h-5 accent-yellow" />
                  <span className="text-lg font-medium text-soft-black">
                    Moteur
                  </span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-blue/20 rounded-xl cursor-pointer hover:bg-blue/30 transition-all duration-300">
                  <input type="checkbox" className="w-5 h-5 accent-yellow" />
                  <span className="text-lg font-medium text-soft-black">
                    Cognitif
                  </span>
                </label>
              </div>
              <Button
                size="lg"
                className="w-full bg-yellow hover:bg-yellow/80 text-soft-black font-bold rounded-full transition-all duration-300">
                Créer le cours
              </Button>
            </div>
          </div>
        );
      case "liste-cours":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue/10 rounded-3xl p-6">
              <h2 className="text-2xl font-extrabold text-soft-black mb-4 tracking-tight">
                Brouillons
              </h2>
              <div className="space-y-4">
                <div className="bg-white/95 p-4 rounded-xl hover:bg-blue/20 transition-all duration-300">
                  <p className="text-lg font-semibold text-soft-black">
                    Apprendre à coder
                  </p>
                  <p className="text-sm text-grey">3 modules</p>
                  <Button
                    size="sm"
                    className="mt-2 bg-blue hover:bg-blue/90 text-white font-bold rounded-full transition-all duration-300">
                    Modifier
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-blue/10 rounded-3xl p-6">
              <h2 className="text-2xl font-extrabold text-soft-black mb-4 tracking-tight">
                Cours publiés
              </h2>
              <div className="space-y-4">
                <div className="bg-white/95 p-4 rounded-xl hover:bg-blue/20 transition-all duration-300">
                  <p className="text-lg font-semibold text-soft-black">
                    Utiliser un PC
                  </p>
                  <p className="text-sm text-grey">12 étudiants</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "ajout-module":
        return (
          <div className="bg-blue/10 rounded-3xl p-6">
            <h2 className="text-2xl font-extrabold text-soft-black mb-4 tracking-tight">
              Ajouter un module
            </h2>
            <div className="space-y-4">
              <select className="w-full p-3 text-lg bg-white/95 rounded-xl text-soft-black focus:ring-2 focus:ring-blue/50 focus:outline-none transition-all duration-300">
                <option>Sélectionner un cours</option>
                <option>Utiliser un PC</option>
                <option>Apprendre à coder</option>
              </select>
              <input
                type="text"
                placeholder="Titre du module"
                className="w-full p-3 text-lg bg-white/95 rounded-xl text-soft-black placeholder-grey focus:ring-2 focus:ring-blue/50 focus:outline-none transition-all duration-300"
              />
              <div className="space-y-3">
                <div className="bg-blue/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Video className="h-6 w-6 text-blue" />
                    <label className="flex-grow text-lg font-medium text-soft-black">
                      Vidéo :{" "}
                      <input type="file" accept="video/*" className="text-sm" />
                    </label>
                  </div>
                </div>
                <div className="bg-blue/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue" />
                    <label className="flex-grow text-lg font-medium text-soft-black">
                      PDF :{" "}
                      <input type="file" accept=".pdf" className="text-sm" />
                    </label>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-yellow hover:bg-yellow/80 text-soft-black font-bold rounded-full transition-all duration-300">
                Ajouter le module
              </Button>
            </div>
          </div>
        );
      case "deconnexion":
        return (
          <div className="bg-blue/10 rounded-3xl p-6 text-center">
            <h2 className="text-2xl font-extrabold text-soft-black mb-4 tracking-tight">
              Déconnexion
            </h2>
            <p className="text-lg text-soft-black font-medium mb-6">
              Voulez-vous vraiment vous déconnecter ?
            </p>
            <Button
              size="lg"
              className="bg-yellow hover:bg-yellow/80 text-soft-black font-bold rounded-full transition-all duration-300">
              Confirmer la déconnexion
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-grey to-rose/20 text-soft-black">
      {/* En-tête */}
      <header className="py-8">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue hover:text-yellow transition-all duration-300 hover:scale-105 bg-white/95 rounded-full px-4 py-2">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
            <div className="bg-white/95 rounded-3xl p-6">
              <h1 className="text-4xl md:text-5xl font-extrabold text-soft-black tracking-tight">
                Tableau de bord - Formateur
              </h1>
            </div>
          </div>

          {/* Onglets de navigation */}
          <div className="bg-white/95 rounded-full p-2 flex flex-wrap gap-2 justify-center">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium text-soft-black hover:bg-blue/20 transition-all duration-300 rounded-full ${
                activeTab === "liste-cours" ? "bg-blue/20" : ""
              }`}
              onClick={() => setActiveTab("liste-cours")}>
              <List className="h-5 w-5 text-blue" />
              Liste des cours
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium text-soft-black hover:bg-blue/20 transition-all duration-300 rounded-full ${
                activeTab === "ajout-cours" ? "bg-blue/20" : ""
              }`}
              onClick={() => setActiveTab("ajout-cours")}>
              <Plus className="h-5 w-5 text-blue" />
              Ajouter un cours
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium text-soft-black hover:bg-blue/20 transition-all duration-300 rounded-full ${
                activeTab === "ajout-module" ? "bg-blue/20" : ""
              }`}
              onClick={() => setActiveTab("ajout-module")}>
              <Upload className="h-5 w-5 text-blue" />
              Ajouter un module
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium text-soft-black hover:bg-blue/20 transition-all duration-300 rounded-full ${
                activeTab === "historique" ? "bg-blue/20" : ""
              }`}
              onClick={() => setActiveTab("historique")}>
              <Clock className="h-5 w-5 text-blue" />
              Historique
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 px-4 py-2 text-lg font-medium text-soft-black hover:bg-blue/20 transition-all duration-300 rounded-full ${
                activeTab === "deconnexion" ? "bg-blue/20" : ""
              }`}
              onClick={() => setActiveTab("deconnexion")}>
              <LogOut className="h-5 w-5 text-blue" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto max-w-6xl px-4 pb-16">
        {renderContent()}
      </div>
    </div>
  );
}
