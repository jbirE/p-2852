
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import BudgetProjetForm from "@/components/BudgetProjetForm";
import { BudgetProjetFormData } from "@/pages/BudgetProjet";
import { ProjectBudget } from "@/components/manager-budget/ProjectBudgetTable";
import { 
  Plus, 
  RefreshCw, 
  Download, 
  Search, 
  Eye, 
  Pencil, 
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Target,
  Users,
  Calendar
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section avec gradient EY */}
      <div className="bg-gradient-to-r from-[#1A1A24] via-[#2A2A3A] to-[#1A1A24] text-white p-8 rounded-2xl mb-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFE600] rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="h-8 w-8 text-[#1A1A24]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Tableau de Bord Budgets
                </h1>
                <p className="text-xl text-gray-300 mt-2">
                  Gestion Intelligente des Budgets - {departmentData.department}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-[#FFE600]" />
                <span>Dernière mise à jour: {formatDateTime(departmentData.lastUpdated)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={handleAddBudget} className="bg-[#FFE600] text-[#1A1A24] hover:bg-[#FFE600]/90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Budget Projet
            </Button>
          </div>
        </div>
      </div>

      {/* Budget Départemental - Design amélioré */}
      <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FFE600] to-[#FFF200] rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-[#1A1A24]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Budget Départemental {departmentData.fiscalYear}</h2>
                <p className="text-gray-600">{departmentData.department}</p>
              </div>
            </div>
            {departmentData.utilizationRate > 90 && (
              <Badge className="bg-red-100 text-red-800 border-red-200 px-4 py-2">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Seuil Critique Atteint
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-blue-700">Budget Total</p>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(departmentData.totalBudget)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-purple-700">Alloué aux Projets</p>
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-900">{formatCurrency(departmentData.allocatedToBudgets)}</p>
            </div>
            
            <div className={`bg-gradient-to-br p-6 rounded-xl border ${
              departmentData.remainingBudget < 50000 
                ? 'from-red-50 to-red-100 border-red-200' 
                : 'from-green-50 to-green-100 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-sm font-medium ${
                  departmentData.remainingBudget < 50000 ? 'text-red-700' : 'text-green-700'
                }`}>Budget Disponible</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  departmentData.remainingBudget < 50000 ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${
                departmentData.remainingBudget < 50000 ? 'text-red-900' : 'text-green-900'
              }`}>
                {formatCurrency(departmentData.remainingBudget)}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">Taux d'Utilisation</p>
                <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <p className={`text-3xl font-bold ${
                  departmentData.utilizationRate > 90 ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {departmentData.utilizationRate}%
                </p>
                <Progress 
                  value={departmentData.utilizationRate} 
                  className="h-3"
                  indicatorColor={departmentData.utilizationRate > 90 ? '#dc2626' : departmentData.utilizationRate > 70 ? '#f59e0b' : '#10b981'}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Métriques rapides - Design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-2">Budgets Alloués</p>
              <p className="text-2xl font-bold text-yellow-900">{formatCurrency(totalAllocated)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700 mb-2">Montant Dépensé</p>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-2">Projets Actifs</p>
              <p className="text-2xl font-bold text-green-900">{activeBudgets}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className={`p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
          overBudgetCount > 0 
            ? 'bg-gradient-to-br from-red-50 to-red-100' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-2 ${
                overBudgetCount > 0 ? 'text-red-700' : 'text-gray-700'
              }`}>Dépassements</p>
              <p className={`text-2xl font-bold ${
                overBudgetCount > 0 ? 'text-red-900' : 'text-gray-900'
              }`}>{overBudgetCount}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              overBudgetCount > 0 ? 'bg-red-500' : 'bg-gray-500'
            }`}>
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Table des projets - Design premium */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FFE600] rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-[#1A1A24]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Budgets des Projets ({filteredBudgets.length})
              </h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-gray-200 focus:border-[#FFE600] focus:ring-[#FFE600]/20"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border-gray-200">
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
                <SelectTrigger className="w-full sm:w-40 border-gray-200">
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
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-gray-900">Projet</TableHead>
                <TableHead className="font-semibold text-gray-900">Budget Alloué</TableHead>
                <TableHead className="font-semibold text-gray-900">Dépensé</TableHead>
                <TableHead className="font-semibold text-gray-900">Restant</TableHead>
                <TableHead className="font-semibold text-gray-900">Utilisation</TableHead>
                <TableHead className="font-semibold text-gray-900">Priorité</TableHead>
                <TableHead className="font-semibold text-gray-900">Statut</TableHead>
                <TableHead className="font-semibold text-gray-900">Date Fin</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow 
                  key={budget.id} 
                  className={`hover:bg-gray-50/50 transition-colors ${
                    budget.status === 'over-budget' ? 'bg-red-50/50' : ''
                  }`}
                >
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold text-gray-900">{budget.projectName}</p>
                      <p className="text-sm text-gray-500">ID: {budget.projectId}</p>
                      {budget.lastExpenseDate && (
                        <p className="text-xs text-gray-400">
                          Dernière dépense: {budget.lastExpenseDate.toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(budget.allocatedAmount)}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(budget.spentAmount)}</TableCell>
                  <TableCell className={`font-semibold ${
                    budget.remainingAmount < 0 ? "text-red-600" : "text-green-600"
                  }`}>
                    {formatCurrency(budget.remainingAmount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress 
                        value={Math.min(budget.utilizationRate, 100)} 
                        className="w-20 h-2"
                        indicatorColor={budget.utilizationRate > 100 ? '#dc2626' : budget.utilizationRate > 80 ? '#f59e0b' : '#10b981'}
                      />
                      <span className={`text-sm font-semibold min-w-[50px] ${
                        budget.utilizationRate > 100 ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {budget.utilizationRate.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={budget.priority === 'high' ? 'destructive' : budget.priority === 'medium' ? 'secondary' : 'outline'}>
                      {budget.priority === 'high' ? 'Haute' : budget.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      budget.status === 'active' ? 'default' : 
                      budget.status === 'completed' ? 'secondary' : 
                      budget.status === 'over-budget' ? 'destructive' : 'outline'
                    }>
                      {budget.status === 'active' ? 'Actif' : 
                       budget.status === 'completed' ? 'Terminé' : 
                       budget.status === 'over-budget' ? 'Dépassé' : 'En Pause'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {budget.endDate.toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100" title="Voir détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditBudget(budget)} className="hover:bg-blue-50 hover:text-blue-600" title="Modifier">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteClick(budget.id)}
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-4">Aucun budget trouvé avec les filtres actuels</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* ... keep existing code (dialogs and forms) */}
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
