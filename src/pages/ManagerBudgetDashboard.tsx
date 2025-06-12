import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import BudgetProjetForm from "@/components/BudgetProjetForm";
import { BudgetProjetFormData } from "@/pages/BudgetProjet";
import DashboardHeader from "@/components/manager-budget/DashboardHeader";
import DepartmentOverview from "@/components/manager-budget/DepartmentOverview";
import MetricsCards from "@/components/manager-budget/MetricsCards";
import ProjectBudgetTable, { ProjectBudget } from "@/components/manager-budget/ProjectBudgetTable";

// Types pour la gestion des budgets
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

// Données de démonstration pour le département du manager
const initialDepartmentData: DepartmentBudget = {
  id: 1,
  department: "Technology & Innovation",
  totalBudget: 500000,
  allocatedToBudgets: 320000,
  remainingBudget: 180000,
  utilizationRate: 64,
  fiscalYear: "2025",
  lastUpdated: new Date()
};

// Données de démonstration pour les budgets de projets
const initialProjectBudgets: ProjectBudget[] = [
  {
    id: 1,
    projectName: "Digital Transformation Platform",
    projectId: 101,
    allocatedAmount: 120000,
    spentAmount: 75000,
    remainingAmount: 45000,
    status: 'active',
    creationDate: new Date("2024-12-01"),
    endDate: new Date("2025-06-30"),
    department: "Technology & Innovation",
    priority: 'high',
    utilizationRate: 62.5,
    lastExpenseDate: new Date("2025-01-15")
  },
  {
    id: 2,
    projectName: "Cloud Migration Initiative",
    projectId: 102,
    allocatedAmount: 85000,
    spentAmount: 30000,
    remainingAmount: 55000,
    status: 'active',
    creationDate: new Date("2025-01-15"),
    endDate: new Date("2025-08-31"),
    department: "Technology & Innovation",
    priority: 'medium',
    utilizationRate: 35.3,
    lastExpenseDate: new Date("2025-01-20")
  },
  {
    id: 3,
    projectName: "Security Enhancement Project",
    projectId: 103,
    allocatedAmount: 65000,
    spentAmount: 70000,
    remainingAmount: -5000,
    status: 'over-budget',
    creationDate: new Date("2024-11-01"),
    endDate: new Date("2025-04-30"),
    department: "Technology & Innovation",
    priority: 'high',
    utilizationRate: 107.7,
    lastExpenseDate: new Date("2025-01-22")
  },
  {
    id: 4,
    projectName: "AI Analytics Integration",
    projectId: 104,
    allocatedAmount: 50000,
    spentAmount: 50000,
    remainingAmount: 0,
    status: 'completed',
    creationDate: new Date("2024-09-01"),
    endDate: new Date("2024-12-31"),
    department: "Technology & Innovation",
    priority: 'medium',
    utilizationRate: 100,
    lastExpenseDate: new Date("2024-12-30")
  }
];

// Projets disponibles pour création de budgets
const availableProjects = [
  { id: 105, name: "Mobile App Development", startDate: new Date("2025-03-01"), endDate: new Date("2025-09-30") },
  { id: 106, name: "Data Warehouse Upgrade", startDate: new Date("2025-02-15"), endDate: new Date("2025-07-15") },
  { id: 107, name: "Customer Portal Enhancement", startDate: new Date("2025-04-01"), endDate: new Date("2025-10-31") },
  { id: 108, name: "Automation Framework", startDate: new Date("2025-05-01"), endDate: new Date("2025-11-30") },
];

const ManagerBudgetDashboard = () => {
  const [departmentData, setDepartmentData] = useState<DepartmentBudget>(initialDepartmentData);
  const [projectBudgets, setProjectBudgets] = useState<ProjectBudget[]>(initialProjectBudgets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetProjetFormData | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulation du suivi en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Simuler des mises à jour automatiques des données
      setDepartmentData(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simuler une actualisation des données
    setTimeout(() => {
      setDepartmentData(prev => ({
        ...prev,
        lastUpdated: new Date()
      }));
      setIsRefreshing(false);
      toast.success("Données actualisées avec succès");
    }, 1000);
  };

  const updateDepartmentBudget = () => {
    const totalAllocated = projectBudgets.reduce((sum, pb) => sum + pb.allocatedAmount, 0);
    const remaining = departmentData.totalBudget - totalAllocated;
    const utilizationRate = (totalAllocated / departmentData.totalBudget) * 100;

    setDepartmentData(prev => ({
      ...prev,
      allocatedToBudgets: totalAllocated,
      remainingBudget: remaining,
      utilizationRate: Math.round(utilizationRate),
      lastUpdated: new Date()
    }));
  };

  const handleAddBudget = () => {
    setCurrentBudget(undefined);
    setIsFormOpen(true);
  };

  const handleEditBudget = (budget: ProjectBudget) => {
    setCurrentBudget({
      id: budget.id,
      projectId: budget.projectId,
      projectName: budget.projectName,
      allocatedAmount: budget.allocatedAmount,
      creationDate: budget.creationDate,
      endDate: budget.endDate,
      totalExpenses: budget.spentAmount,
    });
    setIsFormOpen(true);
  };

  const handleDeleteBudget = () => {
    if (budgetToDelete) {
      setProjectBudgets(prev => {
        const newBudgets = prev.filter(pb => pb.id !== budgetToDelete);
        return newBudgets;
      });
      toast.success("Budget projet supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setBudgetToDelete(null);
      
      // Mettre à jour le budget départemental
      setTimeout(updateDepartmentBudget, 100);
    }
  };

  const handleDeleteClick = (budgetId: number) => {
    setBudgetToDelete(budgetId);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveBudget = (formData: BudgetProjetFormData) => {
    if (formData.id) {
      // Mise à jour budget existant
      setProjectBudgets(prev => prev.map(pb => {
        if (pb.id === formData.id) {
          const spentAmount = formData.totalExpenses || pb.spentAmount;
          const remainingAmount = formData.allocatedAmount - spentAmount;
          const utilizationRate = (spentAmount / formData.allocatedAmount) * 100;
          
          let status: ProjectBudget['status'] = 'active';
          if (utilizationRate >= 100) status = 'over-budget';
          else if (pb.endDate < new Date()) status = 'completed';

          return {
            ...pb,
            projectName: formData.projectName || pb.projectName,
            allocatedAmount: formData.allocatedAmount,
            spentAmount,
            remainingAmount,
            utilizationRate: Math.round(utilizationRate * 10) / 10,
            status,
            creationDate: formData.creationDate,
            endDate: formData.endDate || pb.endDate,
            lastExpenseDate: new Date()
          };
        }
        return pb;
      }));
      toast.success("Budget projet mis à jour avec succès");
    } else {
      // Nouveau budget
      const project = availableProjects.find(p => p.id === formData.projectId);
      const newId = Math.max(...projectBudgets.map(pb => pb.id), 0) + 1;
      
      const spentAmount = formData.totalExpenses || 0;
      const remainingAmount = formData.allocatedAmount - spentAmount;
      const utilizationRate = (spentAmount / formData.allocatedAmount) * 100;
      
      const newBudget: ProjectBudget = {
        id: newId,
        projectName: formData.projectName || project?.name || "Nouveau Projet",
        projectId: formData.projectId,
        allocatedAmount: formData.allocatedAmount,
        spentAmount,
        remainingAmount,
        status: utilizationRate >= 100 ? 'over-budget' : 'active',
        creationDate: formData.creationDate,
        endDate: formData.endDate || project?.endDate || new Date(),
        department: departmentData.department,
        priority: 'medium',
        utilizationRate: Math.round(utilizationRate * 10) / 10,
        lastExpenseDate: spentAmount > 0 ? new Date() : undefined
      };

      setProjectBudgets(prev => [...prev, newBudget]);
      toast.success("Budget projet créé avec succès");
    }
    
    setIsFormOpen(false);
    
    // Mettre à jour le budget départemental
    setTimeout(updateDepartmentBudget, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

  const filteredBudgets = projectBudgets.filter(budget => {
    const matchesSearch = budget.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || budget.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || budget.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculs pour les métriques
  const totalAllocated = projectBudgets.reduce((sum, pb) => sum + pb.allocatedAmount, 0);
  const totalSpent = projectBudgets.reduce((sum, pb) => sum + pb.spentAmount, 0);
  const activeBudgets = projectBudgets.filter(pb => pb.status === 'active').length;
  const overBudgetCount = projectBudgets.filter(pb => pb.status === 'over-budget').length;

  // Mise à jour du budget départemental à chaque changement
  useEffect(() => {
    updateDepartmentBudget();
  }, [projectBudgets]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        departmentName={departmentData.department}
        lastUpdated={departmentData.lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onAddBudget={handleAddBudget}
        formatDateTime={formatDateTime}
      />

      <DepartmentOverview
        departmentData={departmentData}
        formatCurrency={formatCurrency}
      />

      <MetricsCards
        totalAllocated={totalAllocated}
        totalSpent={totalSpent}
        activeBudgets={activeBudgets}
        overBudgetCount={overBudgetCount}
        formatCurrency={formatCurrency}
      />

      <ProjectBudgetTable
        projectBudgets={projectBudgets}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onEdit={handleEditBudget}
        onDelete={handleDeleteClick}
        formatCurrency={formatCurrency}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce budget projet ? Cette action est irréversible et mettra à jour automatiquement le budget départemental.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBudgetToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BudgetProjetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBudget}
        editData={currentBudget}
        projects={availableProjects}
      />
    </div>
  );
};

export default ManagerBudgetDashboard;
