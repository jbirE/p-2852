
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

interface MetricsCardsProps {
  totalAllocated: number;
  totalSpent: number;
  activeBudgets: number;
  overBudgetCount: number;
  formatCurrency: (amount: number) => string;
}

const MetricsCards = ({ 
  totalAllocated, 
  totalSpent, 
  activeBudgets, 
  overBudgetCount, 
  formatCurrency 
}: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Budgets Alloués</p>
            <p className="text-xl font-bold">{formatCurrency(totalAllocated)}</p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-500" />
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Montant Dépensé</p>
            <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-orange-500" />
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Projets Actifs</p>
            <p className="text-xl font-bold">{activeBudgets}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </div>
      </Card>
      
      <Card className={`p-4 ${overBudgetCount > 0 ? 'border-red-200 bg-red-50' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Dépassements</p>
            <p className={`text-xl font-bold ${overBudgetCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {overBudgetCount}
            </p>
          </div>
          <AlertTriangle className={`h-8 w-8 ${overBudgetCount > 0 ? 'text-red-500' : 'text-gray-400'}`} />
        </div>
      </Card>
    </div>
  );
};

export default MetricsCards;
