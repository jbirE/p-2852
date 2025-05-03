
import { useState, useEffect } from "react";
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
  { id: 1, name: "Audit Client XYZ 2025", startDate: new Date("2025-03-01"), endDate: new Date("2025-06-30"), budget: 50000, departmentId: 1, departmentName: "Marketing", responsibleId: "EMP-1234", responsibleName: "Amira Ben Salem" },
  { id: 2, name: "System Migration", startDate: new Date("2025-01-15"), endDate: new Date("2025-12-31"), budget: 120000, departmentId: 5, departmentName: "IT", responsibleId: "EMP-5678", responsibleName: "Mohamed Nasri" },
  { id: 3, name: "Market Research", startDate: new Date("2025-04-01"), endDate: new Date("2025-07-15"), budget: 35000, departmentId: 4, departmentName: "Sales", responsibleId: "EMP-9012", responsibleName: "Karim Dupont" },
];

// Demo departments for dropdown selection
const departments = [
  { id: 1, department: "Marketing", allocated: 50000 },
  { id: 2, department: "Research & Development", allocated: 120000 },
  { id: 3, department: "Operations", allocated: 80000 },
  { id: 4, department: "Sales", allocated: 60000 },
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
      toast.success("Project deleted successfully");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveProject = (formData: ProjectFormData) => {
    if (formData.id) {
      // Update existing project
      setProjects(projects.map(project => {
        if (project.id === formData.id) {
          const departmentName = departments.find(d => d.id === formData.departmentId)?.department || "";
          return {
            ...project,
            name: formData.name,
            startDate: formData.startDate,
            endDate: formData.endDate,
            budget: formData.budget,
            departmentId: formData.departmentId,
            departmentName,
            responsibleId: formData.responsibleId,
            responsibleName: formData.responsibleName
          };
        }
        return project;
      }));
    } else {
      // Add new project
      const newId = Math.max(...projects.map(p => p.id), 0) + 1;
      const departmentName = departments.find(d => d.id === formData.departmentId)?.department || "";
      setProjects([...projects, {
        id: newId,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        departmentId: formData.departmentId,
        departmentName,
        responsibleId: formData.responsibleId || "EMP-0000",
        responsibleName: formData.responsibleName || "Not Assigned"
      }]);
    }
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Projects Management</h1>
          <p className="text-secondary-foreground">Create and manage projects linked to department budgets</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddProject}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </header>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{formatDate(project.startDate)}</TableCell>
                  <TableCell>{formatDate(project.endDate)}</TableCell>
                  <TableCell>${project.budget.toLocaleString()}</TableCell>
                  <TableCell>{project.departmentName}</TableCell>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Projects;
