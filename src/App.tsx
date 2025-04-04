
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Bell, Globe, User } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import BudgetManagement from "./pages/BudgetManagement";
import ExpenseReports from "./pages/ExpenseReports";
import FinancialDashboards from "./pages/FinancialDashboards";
import PredictiveAnalytics from "./pages/PredictiveAnalytics";
import AccessControl from "./pages/AccessControl";

const queryClient = new QueryClient();

const NavBar = () => (
  <div className="h-14 bg-white border-b flex items-center justify-between px-4 ml-64">
    <div className="font-medium text-gray-800">Dashboard Admin</div>
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-gray-600" />
        <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-primary">1</div>
      </div>
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm">English</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
        <div className="text-sm">
          <div className="font-medium">Mohamed Nasri</div>
          <div className="text-xs text-gray-500">Administrator</div>
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
        <div className="flex min-h-screen bg-[#F5F5F5]">
          <Sidebar />
          <div className="flex flex-col flex-1 ml-64">
            <NavBar />
            <main className="p-6">
              <div className="max-w-7xl mx-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/budget-management" element={<BudgetManagement />} />
                  <Route path="/expense-reports" element={<ExpenseReports />} />
                  <Route path="/financial-dashboards" element={<FinancialDashboards />} />
                  <Route path="/predictive-analytics" element={<PredictiveAnalytics />} />
                  <Route path="/access-control" element={<AccessControl />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
