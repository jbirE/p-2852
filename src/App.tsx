
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
