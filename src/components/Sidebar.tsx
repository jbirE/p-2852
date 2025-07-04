
import { 
  Home, 
  Settings, 
  User, 
  Bell, 
  DollarSign, 
  FileText, 
  LayoutDashboard, 
  Lock,
  LogOut,
  Calendar,
  Building,
  Briefcase,
  BarChart,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Tableau de bord", path: "/" },
  { icon: Target, label: "Gestion Budgets Manager", path: "/manager-budget" },
  { icon: BarChart, label: "Budget Département", path: "/budget-departement" },
  { icon: Briefcase, label: "Budget Projet", path: "/budget-projet" },
  { icon: DollarSign, label: "Gestion de Budget", path: "/budget-management" },
  { icon: Calendar, label: "Projets", path: "/projects" },
  { icon: Building, label: "Départements", path: "/departments" },
  { icon: FileText, label: "Rapports de Dépenses", path: "/expense-reports" },
  { icon: LayoutDashboard, label: "Tableaux Financiers", path: "/financial-dashboards" },
  { icon: Lock, label: "Contrôle d'Accès", path: "/access-control" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: User, label: "Profil", path: "/profile" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#1A1A24] text-white border-r border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 mr-3">
              <svg width="32" height="32" viewBox="0 0 69 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_682_22287)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.09 61.4H28.46V69.32H0.669983V34.9H20.37L24.98 42.82H11.1V48.5H23.66V55.72H11.1V61.4H11.09ZM46.94 34.9L41.04 46.13L35.16 34.9H23.64L35.77 55.72V69.32H46.17V55.72L58.3 34.9H46.94Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M68.67 12.81V0L0 24.83L68.67 12.81Z" fill="#FFE600"/>
                </g>
                <defs>
                  <clipPath id="clip0_682_22287">
                    <rect width="68.67" height="69.32" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">BudgetFlow</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-sm transition-all duration-200",
                      "hover:bg-gray-700",
                      isActive ? "bg-gray-700 text-white" : "text-gray-300"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <div className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-sm cursor-pointer">
            <LogOut className="h-4 w-4 mr-3" />
            <span className="text-sm">Déconnexion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
