
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, FileText } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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

// Status badge component
const StatusBadge = ({ status }: { status: 'limite' | 'approche' | 'depasse' }) => {
  const colors = {
    limite: "bg-green-100 text-green-800",
    approche: "bg-yellow-100 text-yellow-800",
    depasse: "bg-red-100 text-red-800",
  };
  
  const labels = {
    limite: "Dans les limites",
    approche: "Approche limite",
    depasse: "Dépassé",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
};

// Demo data for budget projects
const initialBudgetProjects = [
  {
    id: 1,
    projectName: "Audit Client XYZ 2025",
    allocatedAmount: 50000,
    totalExpenses: 30000,
    creationDate: new Date("2024-12-15"),
    endDate: new Date("2025-06-30"),
    status: 'limite' as const
  },
  {
    id: 2,
    projectName: "Migration Système",
    allocatedAmount: 120000,
    totalExpenses: 95000,
    creationDate: new Date("2024-11-01"),
    endDate: new Date("2025-12-31"),
    status: 'approche' as const
  },
  {
    id: 3,
    projectName: "Étude de Marché",
    allocatedAmount: 35000,
    totalExpenses: 35000,
    creationDate: new Date("2025-01-15"),
    endDate: new Date("2025-07-15"),
    status: 'depasse' as const
  },
];

// Demo projects for dropdown in form
const projects = [
  { id: 1, name: "Audit Client XYZ 2025", startDate: new Date("2025-03-01"), endDate: new Date("2025-06-30") },
  { id: 2, name: "Migration Système", startDate: new Date("2025-01-15"), endDate: new Date("2025-12-31") },
  { id: 3, name: "Étude de Marché", startDate: new Date("2025-04-01"), endDate: new Date("2025-07-15") },
  { id: 4, name: "Développement CRM", startDate: new Date("2025-02-01"), endDate: new Date("2025-10-31") },
  { id: 5, name: "Formation Personnel", startDate: new Date("2025-05-01"), endDate: new Date("2025-08-31") },
];

export type BudgetProjetFormData = {
  id?: number;
  projectId: number;
  projectName?: string;
  allocatedAmount: number;
  creationDate: Date;
  endDate?: Date;
  totalExpenses?: number;
  status?: 'limite' | 'approche' | 'depasse';
};

const BudgetProjet = () => {
  const [budgetProjects, setBudgetProjects] = useState(initialBudgetProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBudgetProject, setCurrentBudgetProject] = useState<BudgetProjetFormData | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetProjectToDelete, setBudgetProjectToDelete] = useState<number | null>(null);

  const handleAddBudgetProject = () => {
    setCurrentBudgetProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditBudgetProject = (budgetProject: typeof initialBudgetProjects[0]) => {
    setCurrentBudgetProject({
      id: budgetProject.id,
      projectId: budgetProject.id, // Assuming project ID is the same as budget project ID for demo
      projectName: budgetProject.projectName,
      allocatedAmount: budgetProject.allocatedAmount,
      creationDate: budgetProject.creationDate,
      endDate: budgetProject.endDate,
      totalExpenses: budgetProject.totalExpenses,
      status: budgetProject.status
    });
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setBudgetProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBudgetProject = () => {
    if (budgetProjectToDelete) {
      setBudgetProjects(budgetProjects.filter(bp => bp.id !== budgetProjectToDelete));
      toast.success("Budget projet supprimé avec succès");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveBudgetProject = (formData: BudgetProjetFormData) => {
    // Find project name from project ID
    const project = projects.find(p => p.id === formData.projectId);
    const projectName = project ? project.name : "Projet inconnu";
    
    // Calculate status based on allocated amount and expenses
    const totalExpenses = formData.totalExpenses || 0;
    const percentage = (totalExpenses / formData.allocatedAmount) * 100;
    let status: 'limite' | 'approche' | 'depasse' = 'limite';
    if (percentage >= 100) {
      status = 'depasse';
    } else if (percentage >= 80) {
      status = 'approche';
    }

    if (formData.id) {
      // Update existing budget project
      setBudgetProjects(budgetProjects.map(bp => {
        if (bp.id === formData.id) {
          return {
            ...bp,
            projectName: projectName,
            allocatedAmount: formData.allocatedAmount,
            creationDate: formData.creationDate,
            endDate: formData.endDate,
            totalExpenses: formData.totalExpenses || bp.totalExpenses,
            status: formData.status || status
          };
        }
        return bp;
      }));
      toast.success("Budget projet mis à jour avec succès");
    } else {
      // Add new budget project
      const newId = Math.max(...budgetProjects.map(bp => bp.id), 0) + 1;
      setBudgetProjects([...budgetProjects, {
        id: newId,
        projectName: projectName,
        allocatedAmount: formData.allocatedAmount,
        totalExpenses: formData.totalExpenses || 0,
        creationDate: formData.creationDate,
        endDate: formData.endDate || project?.endDate || new Date(),
        status: status
      }]);
      toast.success("Budget projet créé avec succès");
    }
    
    setIsFormOpen(false);
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Non défini";
    return new Date(date).toLocaleDateString();
  };

  const filteredBudgetProjects = searchTerm 
    ? budgetProjects.filter(bp => 
        bp.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : budgetProjects;

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Budget Projet</h1>
          <p className="text-secondary-foreground">Gérer les budgets alloués aux projets</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddBudgetProject}>
          <Plus className="h-4 w-4" />
          Créer Budget Projet
        </Button>
      </header>

      <Card className="glass-card">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle>Budgets Projets</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom..."
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
                  <TableHead>Nom du Projet</TableHead>
                  <TableHead>Montant Alloué</TableHead>
                  <TableHead>Dépenses Totales</TableHead>
                  <TableHead>Date de Création</TableHead>
                  <TableHead>Date de Fin</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBudgetProjects.map((budgetProject) => (
                  <TableRow key={budgetProject.id}>
                    <TableCell className="font-medium">{budgetProject.projectName}</TableCell>
                    <TableCell>{budgetProject.allocatedAmount.toLocaleString()} DT</TableCell>
                    <TableCell>{budgetProject.totalExpenses.toLocaleString()} DT</TableCell>
                    <TableCell>{formatDate(budgetProject.creationDate)}</TableCell>
                    <TableCell>{formatDate(budgetProject.endDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={budgetProject.status} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditBudgetProject(budgetProject)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleOpenDeleteDialog(budgetProject.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBudgetProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun budget projet trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le budget projet et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudgetProject} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Budget Project Form */}
      <BudgetProjetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBudgetProject}
        editData={currentBudgetProject}
        projects={projects}
      />
    </div>
  );
};

export default BudgetProjet;
