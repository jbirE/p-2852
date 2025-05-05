
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Le nom du département est requis"),
  region: z.string().min(1, "La région est requise"),
  budgetTotal: z.coerce.number().min(0, "Le budget doit être un nombre positif"),
});

export type DepartmentFormData = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DepartmentFormData) => void;
  editData?: DepartmentFormData;
}

const regionOptions = ["Nord", "Sud", "Est", "Ouest", "Centre"];

const DepartmentForm = ({ isOpen, onClose, onSave, editData }: DepartmentFormProps) => {
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      name: "",
      region: "",
      budgetTotal: 0,
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        id: editData.id,
        name: editData.name,
        region: editData.region,
        budgetTotal: editData.budgetTotal,
      });
    } else {
      form.reset({
        id: undefined,
        name: "",
        region: "",
        budgetTotal: 0,
      });
    }
  }, [editData, form]);

  const onSubmit = (data: DepartmentFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Modifier Département" : "Nouveau Département"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du Département</FormLabel>
                  <FormControl>
                    <Input placeholder="Marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une région" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regionOptions.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="budgetTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Total (DT)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {editData ? "Mettre à jour" : "Créer"} Département
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentForm;
