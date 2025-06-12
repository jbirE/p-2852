
import { Button } from "@/components/ui/button";
import { Plus, Download, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  departmentName: string;
  lastUpdated: Date;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddBudget: () => void;
  formatDateTime: (date: Date) => string;
}

const DashboardHeader = ({
  departmentName,
  lastUpdated,
  isRefreshing,
  onRefresh,
  onAddBudget,
  formatDateTime
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Budgets</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
        <p className="text-gray-600">
          Gestion des budgets départementaux et projets - {departmentName}
        </p>
        <p className="text-sm text-gray-500">
          Dernière mise à jour: {formatDateTime(lastUpdated)}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
        <Button onClick={onAddBudget} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Budget Projet
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
