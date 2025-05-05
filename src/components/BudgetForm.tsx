
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  department: z.string().min(1, "Nom du département requis"),
  allocated: z.coerce.number().min(1, "Montant du budget requis"),
  projects: z.coerce.number().min(0, "Nombre de projets requis"),
});

export type BudgetFormData = z.infer<typeof formSchema> & { id?: number };

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BudgetFormData) => void;
  editData?: BudgetFormData;
}

const BudgetForm = ({ isOpen, onClose, onSave, editData }: BudgetFormProps) => {
  const form = useForm<BudgetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      allocated: 0,
      projects: 0,
    },
  });

  // Reset form when opening the modal or when editData changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        form.reset({
          department: editData.department,
          allocated: editData.allocated,
          projects: editData.projects,
        });
      } else {
        form.reset({
          department: "",
          allocated: 0,
          projects: 0,
        });
      }
    }
  }, [isOpen, editData, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const budgetData = editData?.id ? { ...data, id: editData.id } : data;
    onSave(budgetData);
    toast.success(editData ? "Budget mis à jour avec succès" : "Budget ajouté avec succès");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Modifier le Budget" : "Ajouter un Nouveau Budget"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Département</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du département" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allocated"
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
              name="projects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Projets</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
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

export default BudgetForm;
