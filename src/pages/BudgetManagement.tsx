import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, AlertCircle, TrendingUp, TrendingDown, Plus, Pencil, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import BudgetForm, { BudgetFormData } from "@/components/BudgetForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Données de démonstration pour les départements et budgets
const initialBudgets = [
  { id: 1, department: "Marketing", allocated: 50000, spent: 32000, remaining: 18000, projects: 4 },
  { id: 2, department: "Recherche & Développement", allocated: 120000, spent: 75000, remaining: 45000, projects: 3 },
  { id: 3, department: "Opérations", allocated: 80000, spent: 65000, remaining: 15000, projects: 5 },
  { id: 4, department: "Ventes", allocated: 60000, spent: 20000, remaining: 40000, projects: 2 },
  { id: 5, department: "IT", allocated: 100000, spent: 90000, remaining: 10000, projects: 6 },
];

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetFormData | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);

  // Calcul des totaux
  const totalBudget = budgets.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  
  const calculateRemainingBudget = (budget: { allocated: number, spent: number }) => {
    return budget.allocated - budget.spent;
  };

  const handleAddBudget = () => {
    setCurrentBudget(undefined);
    setIsFormOpen(true);
  };

  const handleEditBudget = (budget: typeof budgets[0]) => {
    setCurrentBudget(budget);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setBudgetToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBudget = () => {
    if (budgetToDelete) {
      setBudgets(budgets.filter(budget => budget.id !== budgetToDelete));
      toast.success("Budget deleted successfully");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveBudget = (formData: BudgetFormData) => {
    if (formData.id) {
      // Update existing budget
      setBudgets(budgets.map(budget => {
        if (budget.id === formData.id) {
          const spent = budget.spent;
          const remaining = calculateRemainingBudget({ allocated: formData.allocated, spent });
          return {
            ...budget,
            department: formData.department,
            allocated: formData.allocated,
            remaining,
            projects: formData.projects
          };
        }
        return budget;
      }));
    } else {
      // Add new budget
      const newId = Math.max(...budgets.map(b => b.id)) + 1;
      const spent = 0;
      const remaining = formData.allocated;
      setBudgets([...budgets, {
        id: newId,
        department: formData.department,
        allocated: formData.allocated,
        spent,
        remaining,
        projects: formData.projects
      }]);
    }
  };
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Gestion de Budget</h1>
          <p className="text-secondary-foreground">Allouer et suivre les budgets des départements</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddBudget}>
          <Plus className="h-4 w-4" />
          Nouveau Budget
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Budget Total</p>
              <h2 className="text-2xl font-bold">{totalBudget.toLocaleString()} DT</h2>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alloué</p>
              <h2 className="text-2xl font-bold">{totalSpent.toLocaleString()} DT</h2>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Restant</p>
              <h2 className="text-2xl font-bold">{totalRemaining.toLocaleString()} DT</h2>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alertes</p>
              <h2 className="text-2xl font-bold">
                {budgets.filter(budget => (budget.spent / budget.allocated) > 0.85).length}
              </h2>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Budgets des Départements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Département</TableHead>
                <TableHead>Budget Alloué</TableHead>
                <TableHead>Dépensé</TableHead>
                <TableHead>Restant</TableHead>
                <TableHead>Utilisation</TableHead>
                <TableHead>Projets</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => {
                const usagePercentage = Math.round((budget.spent / budget.allocated) * 100);
                const isAlert = usagePercentage > 85;
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.department}</TableCell>
                    <TableCell>{budget.allocated.toLocaleString()} DT</TableCell>
                    <TableCell>{budget.spent.toLocaleString()} DT</TableCell>
                    <TableCell>{budget.remaining.toLocaleString()} DT</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex items-center gap-2">
                        <Progress value={usagePercentage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{usagePercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{budget.projects}</TableCell>
                    <TableCell>
                      {isAlert ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" /> Alerte
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Stable
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditBudget(budget)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleOpenDeleteDialog(budget.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Budget Form Dialog */}
      <BudgetForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveBudget}
        editData={currentBudget}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le budget et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BudgetManagement;
