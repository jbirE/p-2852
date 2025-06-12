
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";
import StatusBadge, { ProjectStatus } from "./StatusBadge";
import PriorityBadge, { ProjectPriority } from "./PriorityBadge";

export interface ProjectBudget {
  id: number;
  projectName: string;
  projectId: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  status: ProjectStatus;
  creationDate: Date;
  endDate: Date;
  department: string;
  priority: ProjectPriority;
  utilizationRate: number;
  lastExpenseDate?: Date;
}

interface ProjectBudgetTableProps {
  projectBudgets: ProjectBudget[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  onEdit: (budget: ProjectBudget) => void;
  onDelete: (budgetId: number) => void;
  formatCurrency: (amount: number) => string;
}

const ProjectBudgetTable = ({
  projectBudgets,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onEdit,
  onDelete,
  formatCurrency
}: ProjectBudgetTableProps) => {
  const filteredBudgets = projectBudgets.filter(budget => {
    const matchesSearch = budget.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || budget.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || budget.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <CardTitle>Budgets des Projets ({filteredBudgets.length})</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="on-hold">En Pause</SelectItem>
                <SelectItem value="over-budget">Dépassé</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projet</TableHead>
                <TableHead>Budget Alloué</TableHead>
                <TableHead>Dépensé</TableHead>
                <TableHead>Restant</TableHead>
                <TableHead>Utilisation</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date Fin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id} className={budget.status === 'over-budget' ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{budget.projectName}</p>
                      <p className="text-sm text-gray-500">ID: {budget.projectId}</p>
                      {budget.lastExpenseDate && (
                        <p className="text-xs text-gray-400">
                          Dernière dépense: {budget.lastExpenseDate.toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(budget.allocatedAmount)}</TableCell>
                  <TableCell>{formatCurrency(budget.spentAmount)}</TableCell>
                  <TableCell className={budget.remainingAmount < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                    {formatCurrency(budget.remainingAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={Math.min(budget.utilizationRate, 100)} 
                        className="w-16 h-2"
                        indicatorColor={budget.utilizationRate > 100 ? '#dc2626' : budget.utilizationRate > 80 ? '#f59e0b' : '#10b981'}
                      />
                      <span className={`text-xs font-medium ${budget.utilizationRate > 100 ? 'text-red-600' : 'text-gray-600'}`}>
                        {budget.utilizationRate.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={budget.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={budget.status} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {budget.endDate.toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" title="Voir détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEdit(budget)} title="Modifier">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => onDelete(budget.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredBudgets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun budget trouvé avec les filtres actuels</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBudgetTable;
