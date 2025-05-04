
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
  name: z.string().min(1, "Department name is required"),
  region: z.string().min(1, "Region is required"),
  budgetTotal: z.coerce.number().min(0, "Budget must be a positive number"),
});

export type DepartmentFormData = z.infer<typeof formSchema>;

interface DepartmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DepartmentFormData) => void;
  editData?: DepartmentFormData;
}

const regionOptions = ["North", "South", "East", "West", "Central"];

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
          <DialogTitle>{editData ? "Edit Department" : "New Department"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
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
                  <FormLabel>Region</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
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
                  <FormLabel>Total Budget</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editData ? "Update" : "Create"} Department
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentForm;
