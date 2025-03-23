"use client";

import { useState } from "react";
import DashboardHeader from "./components/dashboardHeader";
import NavigationTabs from "./components/navigationTabs";
import DashboardContent from "./components/dashboardContent";

type TabType =
  | "historique"
  | "ajout-cours"
  | "liste-cours"
  | "ajout-module"
  | "deconnexion";

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("liste-cours");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-gray-100 border-[.15rem] border-black p-6">
        <DashboardHeader />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardContent activeTab={activeTab} />
      </div>
    </div>
  );
}
