
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
  department: z.string().min(1, "Department name is required"),
  allocated: z.coerce.number().min(1, "Budget amount is required"),
  projects: z.coerce.number().min(0, "Number of projects is required"),
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
    toast.success(editData ? "Budget updated successfully" : "Budget added successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Budget" : "Add New Budget"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Department name" {...field} />
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
                  <FormLabel>Budget Amount</FormLabel>
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
                  <FormLabel>Number of Projects</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
