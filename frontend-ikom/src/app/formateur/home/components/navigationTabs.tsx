import { Button } from "@/components/ui/button";
import { List, Plus, Upload, Clock, LogOut } from "lucide-react";

// Typage pour les props
type TabType =
  | "historique"
  | "ajout-cours"
  | "liste-cours"
  | "ajout-module"
  | "deconnexion";

interface NavigationTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function NavigationTabs({
  activeTab,
  setActiveTab,
}: NavigationTabsProps) {
  return (
    <div className="bg-white mb-4 border-2 border-black p-2 flex flex-wrap gap-2 justify-center">
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
  );
}
