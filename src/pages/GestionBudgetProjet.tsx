
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
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
import BudgetProjetFormModal from "@/components/manager-budget/BudgetProjetFormModal";
import { BudgetProjetDto, CreatedBudgetProjetDto, UpdatedBudgetProjetDto, ProjetDto } from "@/types/budget-projet";

// Données de démonstration - à remplacer par des appels API
const initialBudgets: BudgetProjetDto[] = [
  {
    idBudgetProjet: 1,
    montantAlloue: 50000,
    depensesTotales: 30000,
    dateCreation: new Date("2024-01-15"),
    dateFinProjet: new Date("2025-06-30"),
    projetId: 1,
    projetNom: "Transformation Digitale",
    utilisateurId: "user1",
    utilisateurNom: "Mohammed Ben Ali"
  },
  {
    idBudgetProjet: 2,
    montantAlloue: 75000,
    depensesTotales: 65000,
    dateCreation: new Date("2024-02-01"),
    dateFinProjet: new Date("2025-08-31"),
    projetId: 2,
    projetNom: "Migration Cloud",
    utilisateurId: "user1",
    utilisateurNom: "Mohammed Ben Ali"
  },
  {
    idBudgetProjet: 3,
    montantAlloue: 30000,
    depensesTotales: 32000,
    dateCreation: new Date("2024-03-10"),
    dateFinProjet: new Date("2025-05-15"),
    projetId: 3,
    projetNom: "Audit Sécurité",
    utilisateurId: "user1",
    utilisateurNom: "Mohammed Ben Ali"
  }
];

const availableProjects: ProjetDto[] = [
  {
    id: 4,
    nom: "Développement Mobile App",
    dateDebut: new Date("2025-01-01"),
    dateFin: new Date("2025-12-31"),
    departementId: 1,
    responsableId: "user1"
  },
  {
    id: 5,
    nom: "Système CRM",
    dateDebut: new Date("2025-02-15"),
    dateFin: new Date("2025-10-30"),
    departementId: 1,
    responsableId: "user1"
  }
];

const GestionBudgetProjet = () => {
  const [budgets, setBudgets] = useState<BudgetProjetDto[]>(initialBudgets);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<BudgetProjetDto | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);

  const filteredBudgets = budgets.filter(budget =>
    budget.projetNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.utilisateurNom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setCurrentBudget(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (budget: BudgetProjetDto) => {
    setCurrentBudget(budget);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setBudgetToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      setBudgets(prev => prev.filter(b => b.idBudgetProjet !== budgetToDelete));
      toast.success("Budget projet supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setBudgetToDelete(null);
    }
  };

  const handleSave = (data: CreatedBudgetProjetDto | UpdatedBudgetProjetDto) => {
    if ('idBudgetProjet' in data) {
      // Update existing budget
      setBudgets(prev => prev.map(budget => {
        if (budget.idBudgetProjet === data.idBudgetProjet) {
          return {
            ...budget,
            montantAlloue: data.montantAlloue
          };
        }
        return budget;
      }));
      toast.success("Budget projet mis à jour avec succès");
    } else {
      // Create new budget
      const project = availableProjects.find(p => p.id === data.projetId);
      const newBudget: BudgetProjetDto = {
        idBudgetProjet: Math.max(...budgets.map(b => b.idBudgetProjet)) + 1,
        montantAlloue: data.montantAlloue,
        depensesTotales: 0,
        dateCreation: new Date(),
        dateFinProjet: project?.dateFin || new Date(),
        projetId: data.projetId,
        projetNom: project?.nom || "Projet Inconnu",
        utilisateurId: "user1",
        utilisateurNom: "Mohammed Ben Ali"
      };
      setBudgets(prev => [...prev, newBudget]);
      toast.success("Budget projet créé avec succès");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  };

  const getBudgetStatus = (budget: BudgetProjetDto) => {
    const utilizationRate = (budget.depensesTotales / budget.montantAlloue) * 100;
    
    if (utilizationRate > 100) {
      return { status: 'over-budget', label: 'Dépassé', color: 'text-red-600 bg-red-50' };
    } else if (utilizationRate >= 80) {
      return { status: 'warning', label: 'Attention', color: 'text-yellow-600 bg-yellow-50' };
    } else {
      return { status: 'healthy', label: 'Normal', color: 'text-green-600 bg-green-50' };
    }
  };

  // Calculs pour les métriques
  const totalAllocated = budgets.reduce((sum, b) => sum + b.montantAlloue, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.depensesTotales, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overBudgetCount = budgets.filter(b => b.depensesTotales > b.montantAlloue).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion Budget Projet</h1>
          <p className="text-gray-600">Créer et gérer les budgets alloués aux projets</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Budget Projet
        </Button>
      </div>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alloué</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAllocated)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Restant</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRemaining)}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">€</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budgets Dépassés</p>
                <p className="text-2xl font-bold text-red-600">{overBudgetCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table des budgets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budgets Projets</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projet</TableHead>
                  <TableHead>Montant Alloué</TableHead>
                  <TableHead>Dépenses</TableHead>
                  <TableHead>Restant</TableHead>
                  <TableHead>Utilisation %</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date Création</TableHead>
                  <TableHead>Date Fin</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBudgets.map((budget) => {
                  const remaining = budget.montantAlloue - budget.depensesTotales;
                  const utilizationRate = (budget.depensesTotales / budget.montantAlloue) * 100;
                  const status = getBudgetStatus(budget);

                  return (
                    <TableRow key={budget.idBudgetProjet}>
                      <TableCell className="font-medium">{budget.projetNom}</TableCell>
                      <TableCell>{formatCurrency(budget.montantAlloue)}</TableCell>
                      <TableCell>{formatCurrency(budget.depensesTotales)}</TableCell>
                      <TableCell className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(remaining)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{utilizationRate.toFixed(1)}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                utilizationRate > 100 ? 'bg-red-500' :
                                utilizationRate >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(budget.dateCreation)}</TableCell>
                      <TableCell>{formatDate(budget.dateFinProjet)}</TableCell>
                      <TableCell>{budget.utilisateurNom}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(budget)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(budget.idBudgetProjet)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire Modal */}
      <BudgetProjetFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        editData={currentBudget}
        availableProjects={availableProjects}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce budget projet ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBudgetToDelete(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestionBudgetProjet;
