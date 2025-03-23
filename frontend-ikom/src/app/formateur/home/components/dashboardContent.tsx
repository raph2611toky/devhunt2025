import HistoryTab from "./historyTab";
import AddCourseTab from "./addCourseTab";
import CourseListTab from "./courseListTab";
import AddModuleTab from "./addModuleTab";
import LogoutTab from "./logoutTab";

// Typage pour les props
type TabType =
  | "historique"
  | "ajout-cours"
  | "liste-cours"
  | "ajout-module"
  | "deconnexion";

interface DashboardContentProps {
  activeTab: TabType;
}

export default function DashboardContent({ activeTab }: DashboardContentProps) {
  const renderContent = () => {
    switch (activeTab) {
      case "historique":
        return <HistoryTab />;
      case "ajout-cours":
        return <AddCourseTab />;
      case "liste-cours":
        return <CourseListTab />;
      case "ajout-module":
        return <AddModuleTab />;
      case "deconnexion":
        return <LogoutTab />;
      default:
        return null;
    }
  };

  return <div className="pb-16">{renderContent()}</div>;
}
