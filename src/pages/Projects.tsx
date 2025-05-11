
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import ProjectForm from "@/components/ProjectForm";
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
  { id: 1, name: "Audit Client XYZ 2025", startDate: new Date("2025-03-01"), endDate: new Date("2025-06-30"), budget: 50000, departmentId: 1, responsibleId: "EMP-5678", responsibleName: "Mohamed Nasri" },
  { id: 2, name: "Migration Système", startDate: new Date("2025-01-15"), endDate: new Date("2025-12-31"), budget: 120000, departmentId: 5, responsibleId: "EMP-5678", responsibleName: "Mohamed Nasri" },
  { id: 3, name: "Étude de Marché", startDate: new Date("2025-04-01"), endDate: new Date("2025-07-15"), budget: 35000, departmentId: 4, responsibleId: "EMP-9012", responsibleName: "Karim Dupont" },
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
};

const Projects = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectFormData | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

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
      responsibleName: project.responsibleName
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
            responsibleName: formData.responsibleName
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
        responsibleName: formData.responsibleName || "Non Assigné"
      }]);
    }
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Non défini";
    return new Date(date).toLocaleDateString();
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

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Projets</CardTitle>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{formatDate(project.startDate)}</TableCell>
                  <TableCell>{formatDate(project.endDate)}</TableCell>
                  <TableCell>{project.budget.toLocaleString()} DT</TableCell>
                  <TableCell>{project.responsibleName}</TableCell>
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
