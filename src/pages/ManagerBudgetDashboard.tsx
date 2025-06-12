
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2, Search, Filter, Download, AlertTriangle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Progress } from "@/components/ui/progress";
import BudgetProjetForm from "@/components/BudgetProjetForm";
import { BudgetProjetFormData } from "@/pages/BudgetProjet";

// Types pour la gestion des budgets
interface DepartmentBudget {
  id: number;
  department: string;
  totalBudget: number;
  allocatedToBudgets: number;
  remainingBudget: number;
  utilizationRate: number;
  fiscalYear: string;
}

interface ProjectBudget {
  id: number;
  projectName: string;
  projectId: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  status: 'active' | 'completed' | 'on-hold' | 'over-budget';
  creationDate: Date;
  endDate: Date;
  department: string;
  priority: 'high' | 'medium' | 'low';
  utilizationRate: number;
}

// Données de démonstration pour le département du manager
const departmentData: DepartmentBudget = {
  id: 1,
  department: "Technology & Innovation",
  totalBudget: 500000,
  allocatedToBudgets: 320000,
  remainingBudget: 180000,
  utilizationRate: 64,
  fiscalYear: "2025"
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
    utilizationRate: 62.5
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
    utilizationRate: 35.3
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
    utilizationRate: 107.7
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
    utilizationRate: 100
  }
];

// Projets disponibles pour création de budgets
const availableProjects = [
  { id: 105, name: "Mobile App Development", startDate: new Date("2025-03-01"), endDate: new Date("2025-09-30") },
  { id: 106, name: "Data Warehouse Upgrade", startDate: new Date("2025-02-15"), endDate: new Date("2025-07-15") },
  { id: 107, name: "Customer Portal Enhancement", startDate: new Date("2025-04-01"), endDate: new Date("2025-10-31") },
  { id: 108, name: "Automation Framework", startDate: new Date("2025-05-01"), endDate: new Date("2025-11-30") },
];

const StatusBadge = ({ status }: { status: ProjectBudget['status'] }) => {
  const variants = {
    'active': "bg-green-100 text-green-800",
    'completed': "bg-blue-100 text-blue-800",
    'on-hold': "bg-yellow-100 text-yellow-800",
    'over-budget': "bg-red-100 text-red-800",
  };

  const labels = {
    'active': "Actif",
    'completed': "Terminé",
    'on-hold': "En Pause",
    'over-budget': "Dépassé",
  };

  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

const PriorityBadge = ({ priority }: { priority: ProjectBudget['priority'] }) => {
  const variants = {
    'high': "bg-red-50 text-red-700 border-red-200",
    'medium': "bg-yellow-50 text-yellow-700 border-yellow-200",
    'low': "bg-gray-50 text-gray-700 border-gray-200",
  };

  const labels = {
    'high': "Haute",
    'medium': "Moyenne",
    'low': "Basse",
  };

  return (
    <Badge variant="outline" className={variants[priority]}>
      {labels[priority]}
    </Badge>
  );
};

const ManagerBudgetDashboard = () => {
  const [projectBudgets, setProjectBudgets] = useState<ProjectBudget[]>(initialProjectBudgets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetProjetFormData | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);

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
      setProjectBudgets(projectBudgets.filter(pb => pb.id !== budgetToDelete));
      toast.success("Budget projet supprimé avec succès");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveBudget = (formData: BudgetProjetFormData) => {
    if (formData.id) {
      // Mise à jour budget existant
      setProjectBudgets(projectBudgets.map(pb => {
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
            utilizationRate,
            status,
            creationDate: formData.creationDate,
            endDate: formData.endDate || pb.endDate
          };
        }
        return pb;
      }));
      toast.success("Budget projet mis à jour avec succès");
    } else {
      // Nouveau budget
      const project = availableProjects.find(p => p.id === formData.projectId);
      const newId = Math.max(...projectBudgets.map(pb => pb.id), 0) + 1;
      
      const newBudget: ProjectBudget = {
        id: newId,
        projectName: formData.projectName || project?.name || "Nouveau Projet",
        projectId: formData.projectId,
        allocatedAmount: formData.allocatedAmount,
        spentAmount: formData.totalExpenses || 0,
        remainingAmount: formData.allocatedAmount - (formData.totalExpenses || 0),
        status: 'active',
        creationDate: formData.creationDate,
        endDate: formData.endDate || project?.endDate || new Date(),
        department: departmentData.department,
        priority: 'medium',
        utilizationRate: ((formData.totalExpenses || 0) / formData.allocatedAmount) * 100
      };

      setProjectBudgets([...projectBudgets, newBudget]);
      toast.success("Budget projet créé avec succès");
    }
    setIsFormOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(amount);
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Budgets</h1>
          <p className="text-gray-600">Gestion des budgets départementaux et projets - {departmentData.department}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button onClick={handleAddBudget} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau Budget Projet
          </Button>
        </div>
      </div>

      {/* Vue d'ensemble du département */}
      <Card className="p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Budget Départemental - {departmentData.fiscalYear}</h2>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {departmentData.department}
          </Badge>
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
            <p className="text-2xl font-bold text-green-600">{formatCurrency(departmentData.remainingBudget)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Taux d'Utilisation</p>
            <div className="flex items-center gap-3">
              <Progress value={departmentData.utilizationRate} className="flex-1" />
              <span className="text-sm font-medium">{departmentData.utilizationRate}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Métriques des projets */}
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
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dépassements</p>
              <p className="text-xl font-bold text-red-600">{overBudgetCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Table des budgets de projets */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <CardTitle>Budgets des Projets</CardTitle>
            
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
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{budget.projectName}</p>
                        <p className="text-sm text-gray-500">ID: {budget.projectId}</p>
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
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditBudget(budget)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => {
                            setBudgetToDelete(budget.id);
                            setIsDeleteDialogOpen(true);
                          }}
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogue de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce budget projet ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Formulaire de budget projet */}
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
