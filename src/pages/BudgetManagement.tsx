
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, AlertCircle, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Demo data for departments and budgets
const departmentBudgets = [
  { id: 1, department: "Marketing", allocated: 50000, spent: 32000, remaining: 18000, projects: 4 },
  { id: 2, department: "Research & Development", allocated: 120000, spent: 75000, remaining: 45000, projects: 3 },
  { id: 3, department: "Operations", allocated: 80000, spent: 65000, remaining: 15000, projects: 5 },
  { id: 4, department: "Sales", allocated: 60000, spent: 20000, remaining: 40000, projects: 2 },
  { id: 5, department: "IT", allocated: 100000, spent: 90000, remaining: 10000, projects: 6 },
];

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState(departmentBudgets);
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Budget Management</h1>
          <p className="text-secondary-foreground">Allocate and track department budgets</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <h2 className="text-2xl font-bold">$410,000.00</h2>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Allocated</p>
              <h2 className="text-2xl font-bold">$282,000.00</h2>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <h2 className="text-2xl font-bold">$128,000.00</h2>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alerts</p>
              <h2 className="text-2xl font-bold">2</h2>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Department Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Allocated Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => {
                const usagePercentage = Math.round((budget.spent / budget.allocated) * 100);
                const isAlert = usagePercentage > 85;
                
                return (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.department}</TableCell>
                    <TableCell>${budget.allocated.toLocaleString()}</TableCell>
                    <TableCell>${budget.spent.toLocaleString()}</TableCell>
                    <TableCell>${budget.remaining.toLocaleString()}</TableCell>
                    <TableCell className="w-[200px]">
                      <div className="flex items-center gap-2">
                        <Progress value={usagePercentage} className="h-2" />
                        <span className="text-xs text-muted-foreground">{usagePercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{budget.projects}</TableCell>
                    <TableCell>
                      {isAlert ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" /> Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Healthy
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetManagement;
