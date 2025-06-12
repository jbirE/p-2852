
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle } from "lucide-react";

interface DepartmentBudget {
  id: number;
  department: string;
  totalBudget: number;
  allocatedToBudgets: number;
  remainingBudget: number;
  utilizationRate: number;
  fiscalYear: string;
  lastUpdated: Date;
}

interface DepartmentOverviewProps {
  departmentData: DepartmentBudget;
  formatCurrency: (amount: number) => string;
}

const DepartmentOverview = ({ departmentData, formatCurrency }: DepartmentOverviewProps) => {
  return (
    <Card className="p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Budget Départemental - {departmentData.fiscalYear}</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {departmentData.department}
          </Badge>
          {departmentData.utilizationRate > 90 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Attention
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Budget Total</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(departmentData.totalBudget)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Alloué aux Projets</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(departmentData.allocatedToBudgets)}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Budget Disponible</p>
          <p className={`text-2xl font-bold ${departmentData.remainingBudget < 50000 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(departmentData.remainingBudget)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Taux d'Utilisation</p>
          <div className="flex items-center gap-3">
            <Progress 
              value={departmentData.utilizationRate} 
              className="flex-1"
              indicatorColor={departmentData.utilizationRate > 90 ? '#dc2626' : departmentData.utilizationRate > 70 ? '#f59e0b' : '#10b981'}
            />
            <span className={`text-sm font-medium ${departmentData.utilizationRate > 90 ? 'text-red-600' : 'text-gray-600'}`}>
              {departmentData.utilizationRate}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DepartmentOverview;
