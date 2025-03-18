
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Plus, Filter } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sample expense reports data
const expenseReportsData = [
  { 
    id: "EXP-001", 
    submittedBy: "Alice Johnson", 
    department: "Marketing", 
    amount: 2500, 
    date: "2023-10-15", 
    status: "approved", 
    approver: "John Smith",
    description: "Q4 Marketing Campaign Expenses"
  },
  { 
    id: "EXP-002", 
    submittedBy: "Bob Williams", 
    department: "Sales", 
    amount: 1750, 
    date: "2023-10-18", 
    status: "pending", 
    approver: "Pending",
    description: "Client Meeting Travel Expenses"
  },
  { 
    id: "EXP-003", 
    submittedBy: "Charlie Davis", 
    department: "R&D", 
    amount: 4200, 
    date: "2023-10-10", 
    status: "approved", 
    approver: "Jane Doe",
    description: "Research Equipment Purchase"
  },
  { 
    id: "EXP-004", 
    submittedBy: "Diana Brown", 
    department: "Operations", 
    amount: 950, 
    date: "2023-10-20", 
    status: "rejected", 
    approver: "Michael Johnson",
    description: "Office Supplies Restock"
  },
  { 
    id: "EXP-005", 
    submittedBy: "Evan White", 
    department: "IT", 
    amount: 3300, 
    date: "2023-10-22", 
    status: "pending", 
    approver: "Pending",
    description: "Software License Renewal"
  },
];

const statusIcons = {
  approved: <CheckCircle className="h-4 w-4 text-green-500" />,
  rejected: <XCircle className="h-4 w-4 text-red-500" />,
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
};

const statusColors = {
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const ExpenseReports = () => {
  const [reports, setReports] = useState(expenseReportsData);
  
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Expense Reports</h1>
          <p className="text-secondary-foreground">Manage expense reports and approval workflows</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Expense Report
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <h2 className="text-2xl font-bold">5</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <h2 className="text-2xl font-bold">2</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <h2 className="text-2xl font-bold">2</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <h2 className="text-2xl font-bold">1</h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expense Reports</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>{report.submittedBy}</TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell>${report.amount.toLocaleString()}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[report.status as keyof typeof statusColors]}>
                      <span className="flex items-center gap-1">
                        {statusIcons[report.status as keyof typeof statusIcons]}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{report.approver}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseReports;
