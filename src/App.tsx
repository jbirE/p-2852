
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Bell, Globe, User } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ManagerBudgetDashboard from "./pages/ManagerBudgetDashboard";
import BudgetManagement from "./pages/BudgetManagement";
import ExpenseReports from "./pages/ExpenseReports";
import FinancialDashboards from "./pages/FinancialDashboards";
import AccessControl from "./pages/AccessControl";
import Projects from "./pages/Projects";
import Departments from "./pages/Departments";
import Missions from "./pages/Missions";
import RevenusMissions from "./pages/RevenusMissions";
import Notifications from "./pages/Notifications";
import BudgetDepartement from "./pages/BudgetDepartement";
import BudgetProjet from "./pages/BudgetProjet";
import GestionBudgetProjet from "./pages/GestionBudgetProjet";

const queryClient = new QueryClient();

const NavBar = () => (
  <div className="h-14 bg-[#1A1A24] border-b border-gray-700 flex items-center justify-between px-4 w-full">
    <div className="font-medium text-white ml-64">Dashboard Financier</div>
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-gray-300" />
        <div className="w-5 h-5 bg-[#FFE600] rounded-full flex items-center justify-center text-xs font-bold text-[#1A1A24]">1</div>
      </div>
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-300" />
        <span className="text-sm text-gray-300">Français</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#FFE600] flex items-center justify-center">
          <User className="w-5 h-5 text-[#1A1A24]" />
        </div>
        <div className="text-sm">
          <div className="font-medium text-white">Emma Jbir</div>
          <div className="text-xs text-gray-300">Financier</div>
        </div>
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Route d'authentification sans layout */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Routes avec layout complet */}
          <Route path="/*" element={
            <div className="flex min-h-screen bg-[#F6F6FA]">
              <Sidebar />
              <div className="flex flex-col flex-1">
                <NavBar />
                <main className="p-6 ml-64">
                  <div className="max-w-7xl mx-auto">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/manager-budget" element={<ManagerBudgetDashboard />} />
                      <Route path="/gestion-budget-projet" element={<GestionBudgetProjet />} />
                      <Route path="/budget-departement" element={<BudgetDepartement />} />
                      <Route path="/budget-projet" element={<BudgetProjet />} />
                      <Route path="/budget-management" element={<BudgetManagement />} />
                      <Route path="/expense-reports" element={<ExpenseReports />} />
                      <Route path="/financial-dashboards" element={<FinancialDashboards />} />
                      <Route path="/access-control" element={<AccessControl />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/departments" element={<Departments />} />
                      <Route path="/missions" element={<Missions />} />
                      <Route path="/revenus-missions" element={<RevenusMissions />} />
                      <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
