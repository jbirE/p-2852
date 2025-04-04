
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  reportId: z.string().min(1, "Report ID is required"),
  projectName: z.string().min(1, "Project name is required"),
  projectCode: z.string().min(1, "Project code is required"),
  department: z.string().min(1, "Department is required"),
  period: z.string().min(1, "Period is required"),
  submittedBy: z.string().min(1, "Submitter name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  submissionDate: z.string().min(1, "Submission date is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  invoiceId: z.string().min(1, "Invoice ID is required"),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export type ExpenseFormData = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseFormData) => void;
}

const departmentOptions = ["Audit", "Tax", "Advisory", "Marketing", "Operations", "IT", "Sales", "HR"];
const categoryOptions = ["Transport", "Accommodation", "Meals", "Office Supplies", "Equipment", "Software", "Communication", "Other"];

const ExpenseReportForm = ({ isOpen, onClose, onSave }: ExpenseFormProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportId: `RPT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      projectName: "",
      projectCode: "",
      department: "",
      period: "",
      submittedBy: "",
      employeeId: "",
      submissionDate: new Date().toISOString().split('T')[0],
      description: "",
      amount: 0,
      invoiceId: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      category: "",
      notes: "",
      status: "pending",
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    if (files.length === 0) {
      toast.error("Please upload at least one invoice file");
      return;
    }
    
    onSave(data);
    toast.success("Expense report submitted successfully");
    onClose();
    
    // Reset form and files
    form.reset();
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Expense Report</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Report Information</h3>
                
                <FormField
                  control={form.control}
                  name="reportId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report ID</FormLabel>
                      <FormControl>
                        <Input placeholder="RPT-2025-001" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Audit Client XYZ 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="projectCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Code</FormLabel>
                      <FormControl>
                        <Input placeholder="PRJ-XYZ-25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentOptions.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl>
                        <Input placeholder="Mars 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Submitter Information</h3>
                
                <FormField
                  control={form.control}
                  name="submittedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submitted By</FormLabel>
                      <FormControl>
                        <Input placeholder="Amira Ben Salem" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input placeholder="EMP-1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="submissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submission Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pending" id="pending" />
                            <label htmlFor="pending" className="text-sm">Pending</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="approved" id="approved" />
                            <label htmlFor="approved" className="text-sm">Approved</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rejected" id="rejected" />
                            <label htmlFor="rejected" className="text-sm">Rejected</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Expense Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Déplacement Tunis-Sfax" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (TND)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="150.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice ID</FormLabel>
                      <FormControl>
                        <Input placeholder="FAC-2025-XYZ-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about the expense"
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Invoice Attachments</h3>
              
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload invoice files</p>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Attached Files:</p>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Submit Expense Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseReportForm;
