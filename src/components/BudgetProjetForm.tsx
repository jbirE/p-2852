
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BudgetProjetFormData } from "@/pages/BudgetProjet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectForm from "@/components/ProjectForm";

const formSchema = z.object({
  projectId: z.coerce.number().min(1, "Projet requis"),
  allocatedAmount: z.coerce.number().min(1, "Montant alloué requis"),
  creationDate: z.date({
    required_error: "Date de création requise",
  }),
  endDate: z.date().optional(),
  totalExpenses: z.coerce.number().min(0).optional(),
});

interface BudgetProjetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BudgetProjetFormData) => void;
  editData?: BudgetProjetFormData;
  projects: { id: number; name: string; startDate: Date; endDate?: Date }[];
}

const BudgetProjetForm = ({ isOpen, onClose, onSave, editData, projects }: BudgetProjetFormProps) => {
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectId: 0,
      allocatedAmount: 0,
      creationDate: new Date(),
      totalExpenses: 0,
    },
  });

  // Reset form when opening the modal or when editData changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("existing");
      if (editData) {
        form.reset({
          projectId: editData.projectId,
          allocatedAmount: editData.allocatedAmount,
          creationDate: editData.creationDate,
          endDate: editData.endDate,
          totalExpenses: editData.totalExpenses || 0,
        });
      } else {
        form.reset({
          projectId: 0,
          allocatedAmount: 0,
          creationDate: new Date(),
          endDate: undefined,
          totalExpenses: 0,
        });
      }
    }
  }, [isOpen, editData, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Create budgetData with all required properties explicitly assigned
    const budgetData: BudgetProjetFormData = {
      projectId: data.projectId,
      allocatedAmount: data.allocatedAmount,
      creationDate: data.creationDate,
      endDate: data.endDate,
      totalExpenses: data.totalExpenses || 0,
    };
    
    // If we're editing an existing budget project, include its ID
    if (editData?.id) {
      budgetData.id = editData.id;
    }
    
    onSave(budgetData);
  };

  const handleProjectSelect = (projectId: number) => {
    const selectedProject = projects.find(p => p.id === projectId);
    if (selectedProject) {
      form.setValue("endDate", selectedProject.endDate);
    }
  };
  
  const createNewProject = () => {
    setIsProjectFormOpen(true);
  };

  const handleNewProjectSave = () => {
    setIsProjectFormOpen(false);
    // In a real app, we would add the new project to the projects list
    // and set it as the selected project
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Modifier le Budget Projet" : "Créer un Budget Projet"}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "existing" | "new")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Projet Existant</TabsTrigger>
            <TabsTrigger value="new">Nouveau Projet</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Projet</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          handleProjectSelect(parseInt(value));
                        }}
                        value={field.value.toString()}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un projet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="allocatedAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant Alloué (DT)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="creationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de Création</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Choisir une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de Fin</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Choisir une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {editData && (
                  <FormField
                    control={form.control}
                    name="totalExpenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dépenses Totales (DT)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Créer un nouveau projet avant d'allouer un budget.
              </p>
              <Button onClick={createNewProject} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Créer un Nouveau Projet
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Project Form Dialog */}
      <ProjectForm 
        isOpen={isProjectFormOpen} 
        onClose={() => setIsProjectFormOpen(false)} 
        onSave={handleNewProjectSave}
        editData={undefined}
        departments={[
          { id: 1, department: "Marketing", allocated: 50000 },
          { id: 2, department: "Recherche & Développement", allocated: 120000 },
          { id: 3, department: "Opérations", allocated: 80000 },
          { id: 4, department: "Ventes", allocated: 60000 },
          { id: 5, department: "IT", allocated: 100000 },
        ]}
      />
    </Dialog>
  );
};

export default BudgetProjetForm;
