
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
import { toast } from "sonner";
import { ProjectFormData } from "@/pages/Projects";

const formSchema = z.object({
  name: z.string().min(1, "Nom du projet requis"),
  startDate: z.date({
    required_error: "Date de début requise",
  }),
  endDate: z.date().optional(),
  budget: z.coerce.number().min(1, "Montant du budget requis"),
  departmentId: z.coerce.number().min(1, "Département requis"),
  responsibleId: z.string().optional(),
  responsibleName: z.string().optional(),
});

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectFormData) => void;
  editData?: ProjectFormData;
  departments: { id: number; department: string }[];
}

const ProjectForm = ({ isOpen, onClose, onSave, editData, departments }: ProjectFormProps) => {
  // Liste modifiée des responsables sans Amira Ben Salem
  const responsiblePersons = [
    { id: "EMP-5678", name: "Mohamed Nasri" },
    { id: "EMP-9012", name: "Karim Dupont" },
    { id: "EMP-3456", name: "Sarah Mansour" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      budget: 0,
      departmentId: 0,
    },
  });

  // Reset form when opening the modal or when editData changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        form.reset({
          name: editData.name,
          startDate: editData.startDate,
          endDate: editData.endDate,
          budget: editData.budget,
          departmentId: editData.departmentId,
          responsibleId: editData.responsibleId,
          responsibleName: editData.responsibleName,
        });
      } else {
        form.reset({
          name: "",
          startDate: new Date(),
          endDate: undefined,
          budget: 0,
          departmentId: 0,
          responsibleId: "",
          responsibleName: "",
        });
      }
    }
  }, [isOpen, editData, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Find responsible person name from ID
    const responsiblePerson = responsiblePersons.find(person => person.id === data.responsibleId);
    
    // Create projectData with all required properties explicitly assigned
    const projectData: ProjectFormData = {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      budget: data.budget,
      departmentId: data.departmentId,
      responsibleId: data.responsibleId || "",
      responsibleName: responsiblePerson?.name || ""
    };
    
    // If we're editing an existing project, include its ID
    if (editData?.id) {
      projectData.id = editData.id;
    }
    
    onSave(projectData);
    toast.success(editData ? "Projet mis à jour avec succès" : "Projet ajouté avec succès");
    onClose();
  };
  
  const handleResponsibleChange = (value: string) => {
    const person = responsiblePersons.find(p => p.id === value);
    form.setValue("responsibleId", value);
    form.setValue("responsibleName", person?.name || "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Modifier le Projet" : "Ajouter un Nouveau Projet"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du Projet</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du projet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de Début</FormLabel>
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
                    <FormLabel>Date de Fin (Optionnel)</FormLabel>
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
                          disabled={(date) => date < form.getValues("startDate")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant du Budget (DT)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un département" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="responsibleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <Select
                    onValueChange={handleResponsibleChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un responsable" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {responsiblePersons.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;
