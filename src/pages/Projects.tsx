import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ProjectForm from "@/components/ProjectForm";
import ProjectStatusBadge from "@/components/ProjectStatusBadge";
import { ProjetStatus } from "@/types/project-status";
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

// Demo data for projects
const initialProjects = [
  { id: 1, name: "Audit Client XYZ 2025", startDate: new Date("2025-03-01"), endDate: new Date("2025-06-30"), budget: 50000, departmentId: 1, responsibleId: "EMP-5678", responsibleName: "Mohamed Nasri", status: 'InProgress' as ProjetStatus },
  { id: 2, name: "Migration Système", startDate: new Date("2025-01-15"), endDate: new Date("2025-12-31"), budget: 120000, departmentId: 5, responsibleId: "EMP-5678", responsibleName: "Mohamed Nasri", status: 'InProgress' as ProjetStatus },
  { id: 3, name: "Étude de Marché", startDate: new Date("2025-04-01"), endDate: new Date("2025-07-15"), budget: 35000, departmentId: 4, responsibleId: "EMP-9012", responsibleName: "Karim Dupont", status: 'NotStarted' as ProjetStatus },
];

// Demo departments for dropdown selection
const departments = [
  { id: 1, department: "Marketing", allocated: 50000 },
  { id: 2, department: "Recherche & Développement", allocated: 120000 },
  { id: 3, department: "Opérations", allocated: 80000 },
  { id: 4, department: "Ventes", allocated: 60000 },
  { id: 5, department: "IT", allocated: 100000 },
];

export type ProjectFormData = {
  id?: number;
  name: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
  departmentId: number;
  responsibleId?: string;
  responsibleName?: string;
  status?: ProjetStatus;
};

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectFormData | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [responsibleFilter, setResponsibleFilter] = useState<string>("all");

  const handleAddProject = () => {
    setCurrentProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: typeof projects[0]) => {
    setCurrentProject({
      id: project.id,
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget,
      departmentId: project.departmentId,
      responsibleId: project.responsibleId,
      responsibleName: project.responsibleName,
      status: project.status
    });
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setProjectToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProject = () => {
    if (projectToDelete) {
      setProjects(projects.filter(project => project.id !== projectToDelete));
      toast.success("Projet supprimé avec succès");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveProject = (formData: ProjectFormData) => {
    if (formData.id) {
      // Update existing project
      setProjects(projects.map(project => {
        if (project.id === formData.id) {
          return {
            ...project,
            name: formData.name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            budget: formData.budget,
            departmentId: formData.departmentId,
            responsibleId: formData.responsibleId,
            responsibleName: formData.responsibleName,
            status: formData.status || 'NotStarted'
          };
        }
        return project;
      }));
    } else {
      // Add new project
      const newId = Math.max(...projects.map(p => p.id), 0) + 1;
      setProjects([...projects, {
        id: newId,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        departmentId: formData.departmentId,
        responsibleId: formData.responsibleId || "EMP-0000",
        responsibleName: formData.responsibleName || "Non Assigné",
        status: formData.status || 'NotStarted'
      }]);
    }
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Non défini";
    return new Date(date).toLocaleDateString();
  };

  // Get unique responsible persons for filter
  const uniqueResponsibles = Array.from(
    new Set(projects.map(p => p.responsibleName).filter(Boolean))
  );

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesResponsible = responsibleFilter === "all" || project.responsibleName === responsibleFilter;
    
    return matchesSearch && matchesStatus && matchesResponsible;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setResponsibleFilter("all");
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Gestion des Projets</h1>
          <p className="text-secondary-foreground">Créer et gérer les projets liés aux budgets départementaux</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddProject}>
          <Plus className="h-4 w-4" />
          Nouveau Projet
        </Button>
      </header>

      {/* Filter Section */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <Input
                placeholder="Nom du projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="NotStarted">Non Commencé</SelectItem>
                  <SelectItem value="InProgress">En Cours</SelectItem>
                  <SelectItem value="Completed">Terminé</SelectItem>
                  <SelectItem value="OnHold">En Pause</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Responsable</label>
              <Select value={responsibleFilter} onValueChange={setResponsibleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les responsables" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les responsables</SelectItem>
                  {uniqueResponsibles.map((responsible) => (
                    <SelectItem key={responsible} value={responsible!}>
                      {responsible}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={clearFilters}>
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Projets ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Projet</TableHead>
                <TableHead>Date de Début</TableHead>
                <TableHead>Date de Fin</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{formatDate(project.startDate)}</TableCell>
                  <TableCell>{formatDate(project.endDate)}</TableCell>
                  <TableCell>{project.budget.toLocaleString()} DT</TableCell>
                  <TableCell>{project.responsibleName}</TableCell>
                  <TableCell>
                    <ProjectStatusBadge status={project.status} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleOpenDeleteDialog(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun projet trouvé avec les filtres actuels
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <ProjectForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveProject}
        editData={currentProject}
        departments={departments}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le projet et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
