
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Building, MapPin } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DepartmentForm, { DepartmentFormData } from "@/components/DepartmentForm";

// Sample departments data
const departmentsData = [
  { id: 1, name: "Marketing", region: "North", budgetTotal: 50000, projectsCount: 4, employeesCount: 12 },
  { id: 2, name: "Research & Development", region: "Central", budgetTotal: 120000, projectsCount: 3, employeesCount: 15 },
  { id: 3, name: "Operations", region: "South", budgetTotal: 80000, projectsCount: 5, employeesCount: 20 },
  { id: 4, name: "Sales", region: "East", budgetTotal: 60000, projectsCount: 2, employeesCount: 8 },
  { id: 5, name: "IT", region: "West", budgetTotal: 100000, projectsCount: 6, employeesCount: 18 },
];

interface Department extends DepartmentFormData {
  projectsCount: number;
  employeesCount: number;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>(departmentsData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | undefined>(undefined);
  
  const handleAddDepartment = () => {
    setCurrentDepartment(undefined);
    setIsFormOpen(true);
  };

  const handleEditDepartment = (department: Department) => {
    setCurrentDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(departments.filter(dept => dept.id !== id));
    toast.success("Department deleted successfully");
  };

  const handleSaveDepartment = (data: DepartmentFormData) => {
    if (data.id) {
      // Update existing department
      setDepartments(departments.map(dept => 
        dept.id === data.id ? { ...dept, ...data } : dept
      ));
      toast.success("Department updated successfully");
    } else {
      // Add new department
      const newId = Math.max(0, ...departments.map(dept => dept.id)) + 1;
      const newDepartment: Department = { 
        id: newId, 
        name: data.name, 
        region: data.region, 
        budgetTotal: data.budgetTotal,
        projectsCount: 0,
        employeesCount: 0
      };
      setDepartments([...departments, newDepartment]);
      toast.success("Department added successfully");
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Departments</h1>
          <p className="text-secondary-foreground">Manage organization departments and their budgets</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddDepartment}>
          <Plus className="h-4 w-4" />
          New Department
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Departments</p>
              <h2 className="text-2xl font-bold">{departments.length}</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Regions</p>
              <h2 className="text-2xl font-bold">
                {new Set(departments.map(dept => dept.region)).size}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <h2 className="text-2xl font-bold">
                ${departments.reduce((sum, dept) => sum + dept.budgetTotal, 0).toLocaleString()}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Department List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.id}</TableCell>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{department.region}</Badge>
                  </TableCell>
                  <TableCell>${department.budgetTotal.toLocaleString()}</TableCell>
                  <TableCell>{department.projectsCount}</TableCell>
                  <TableCell>{department.employeesCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditDepartment(department)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteDepartment(department.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DepartmentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveDepartment}
        editData={currentDepartment}
      />
    </div>
  );
};

export default Departments;
