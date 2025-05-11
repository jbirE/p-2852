import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Plus, Filter, Eye, Mail, FileExport } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ExpenseReportForm, { ExpenseFormData } from "@/components/ExpenseReportForm";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

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
    description: "Dépenses Campagne Marketing Q4",
    category: "Marketing",
    projectId: "PRJ-001",
    projectName: "Campagne d'Été",
    attachments: 2,
    approvalSteps: [
      { step: 1, approver: "Chef d'Équipe", status: "approved", date: "2023-10-16" },
      { step: 2, approver: "Responsable Département", status: "approved", date: "2023-10-17" }
    ]
  },
  { 
    id: "EXP-002", 
    submittedBy: "Bob Williams", 
    department: "Ventes", 
    amount: 1750, 
    date: "2023-10-18", 
    status: "pending", 
    approver: "En attente",
    description: "Frais de Déplacement Client",
    category: "Transport",
    projectId: "PRJ-002",
    projectName: "Acquisition Client Q4",
    attachments: 3,
    approvalSteps: [
      { step: 1, approver: "Chef d'Équipe", status: "approved", date: "2023-10-19" },
      { step: 2, approver: "Responsable Département", status: "pending", date: null }
    ]
  },
  { 
    id: "EXP-003", 
    submittedBy: "Charlie Davis", 
    department: "R&D", 
    amount: 4200, 
    date: "2023-10-10", 
    status: "approved", 
    approver: "Jane Doe",
    description: "Achat Équipement Recherche",
    category: "Équipement",
    projectId: "PRJ-003",
    projectName: "Innovation Produit",
    attachments: 1,
    approvalSteps: [
      { step: 1, approver: "Chef d'Équipe", status: "approved", date: "2023-10-11" },
      { step: 2, approver: "Responsable Département", status: "approved", date: "2023-10-12" }
    ]
  },
  { 
    id: "EXP-004", 
    submittedBy: "Diana Brown", 
    department: "Opérations", 
    amount: 950, 
    date: "2023-10-20", 
    status: "rejected", 
    approver: "Michael Johnson",
    description: "Réapprovisionnement Fournitures",
    category: "Fournitures",
    projectId: "PRJ-004",
    projectName: "Gestion Bureau",
    attachments: 1,
    approvalSteps: [
      { step: 1, approver: "Chef d'Équipe", status: "approved", date: "2023-10-21" },
      { step: 2, approver: "Responsable Département", status: "rejected", date: "2023-10-22", reason: "Justification insuffisante pour les fournitures premium" }
    ]
  },
  { 
    id: "EXP-005", 
    submittedBy: "Evan White", 
    department: "IT", 
    amount: 3300, 
    date: "2023-10-22", 
    status: "pending", 
    approver: "En attente",
    description: "Renouvellement Licence Logiciel",
    category: "Logiciel",
    projectId: "PRJ-005",
    projectName: "Infrastructure IT",
    attachments: 2,
    approvalSteps: [
      { step: 1, approver: "Chef d'Équipe", status: "approved", date: "2023-10-23" },
      { step: 2, approver: "Responsable Département", status: "pending", date: null }
    ]
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<null | any>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  // Count by status
  const approvedCount = reports.filter(r => r.status === 'approved').length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const rejectedCount = reports.filter(r => r.status === 'rejected').length;
  
  const handleAddExpenseReport = (data: ExpenseFormData) => {
    const newReport = {
      id: data.reportId,
      submittedBy: data.submittedBy,
      department: data.department,
      amount: data.amount,
      date: data.submissionDate,
      status: "pending",
      approver: "En attente",
      description: data.description,
      category: data.category,
      projectId: data.projectCode,
      projectName: data.projectName,
      attachments: 1,
      approvalSteps: [
        { step: 1, approver: "Chef d'Équipe", status: "pending", date: null }
      ]
    };
    
    setReports([newReport, ...reports]);
    toast.success("Rapport de dépense soumis avec succès");
    
    // Send email notification (simulated)
    toast.info("Notification envoyée aux approbateurs");
  };

  const viewApprovalWorkflow = (report: any) => {
    setSelectedReport(report);
    setApprovalModalOpen(true);
  };

  const handleApproveReport = (reportId: string, step: number) => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        const updatedSteps = report.approvalSteps.map((s: any) => 
          s.step === step 
            ? { ...s, status: 'approved', date: new Date().toISOString().split('T')[0] }
            : s
        );
        
        // Check if all steps are approved
        const allApproved = updatedSteps.every((step: any) => step.status === 'approved');
        
        return {
          ...report,
          approvalSteps: updatedSteps,
          status: allApproved ? 'approved' : 'pending',
          approver: allApproved ? "Système" : "En attente"
        };
      }
      return report;
    }));
    
    toast.success(`Étape d'approbation ${step} complétée`);
    toast.info("Notification envoyée au soumetteur");
  };

  const handleRejectReport = (reportId: string, step: number) => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        const updatedSteps = report.approvalSteps.map((s: any) => 
          s.step === step 
            ? { ...s, status: 'rejected', date: new Date().toISOString().split('T')[0], reason: "Rejeté par l'approbateur" }
            : s
        );
        
        return {
          ...report,
          approvalSteps: updatedSteps,
          status: 'rejected',
          approver: "Système"
        };
      }
      return report;
    }));
    
    toast.error(`Rapport ${reportId} a été rejeté`);
    toast.info("Notification envoyée au soumetteur");
  };

  const sendReminderEmail = (reportId: string) => {
    toast.success(`Rappel envoyé pour le rapport ${reportId}`);
  };

  const exportReports = (format: string) => {
    toast.success(`Rapports exportés au format ${format}`);
  };

  const approveOrRejectReport = (reportId: string, action: 'approve' | 'reject') => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          status: action === 'approve' ? 'approved' : 'rejected',
          approver: "Action directe"
        };
      }
      return report;
    }));
    
    toast.success(
      action === 'approve' 
        ? `Rapport ${reportId} a été approuvé directement` 
        : `Rapport ${reportId} a été rejeté directement`
    );
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Rapports de Dépenses</h1>
          <p className="text-secondary-foreground">Gérer les rapports de dépenses et les flux d'approbation</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Nouveau Rapport de Dépense
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total des Rapports</p>
              <h2 className="text-2xl font-bold">{reports.length}</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approuvés</p>
              <h2 className="text-2xl font-bold">{approvedCount}</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Attente</p>
              <h2 className="text-2xl font-bold">{pendingCount}</h2>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejetés</p>
              <h2 className="text-2xl font-bold">{rejectedCount}</h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rapports de Dépenses</CardTitle>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <FileExport className="h-4 w-4" />
                  Exporter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-2">
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => exportReports('excel')}>
                    Format Excel
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => exportReports('pdf')}>
                    Format PDF
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => exportReports('csv')}>
                    Format CSV
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Rapport</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Soumis Par</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>{report.projectName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.category}</Badge>
                  </TableCell>
                  <TableCell>{report.submittedBy}</TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell>{report.amount.toLocaleString()} DT</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[report.status as keyof typeof statusColors]}>
                      <span className="flex items-center gap-1">
                        {statusIcons[report.status as keyof typeof statusIcons]}
                        {report.status === 'approved' ? 'Approuvé' : 
                         report.status === 'rejected' ? 'Rejeté' : 'En Attente'}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {report.status === 'pending' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-green-600 hover:text-green-800" 
                            onClick={() => approveOrRejectReport(report.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1 text-red-600 hover:text-red-800" 
                            onClick={() => approveOrRejectReport(report.id, 'reject')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => viewApprovalWorkflow(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {report.status === 'pending' && (
                        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => sendReminderEmail(report.id)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">...</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 bg-white">
                          <div className="grid gap-2">
                            <Button variant="ghost" size="sm" className="justify-start">Voir les Détails</Button>
                            <Button variant="ghost" size="sm" className="justify-start">Télécharger PDF</Button>
                            <Button variant="ghost" size="sm" className="justify-start">Exporter vers Comptabilité</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Expense Report Form Modal */}
      <ExpenseReportForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleAddExpenseReport}
      />

      {/* Approval Workflow Dialog */}
      {selectedReport && (
        <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Flux d'Approbation - {selectedReport.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <p><strong>Description:</strong> {selectedReport.description}</p>
                <p><strong>Projet:</strong> {selectedReport.projectName}</p>
                <p><strong>Montant:</strong> {selectedReport.amount.toLocaleString()} DT</p>
                <p><strong>Soumis Par:</strong> {selectedReport.submittedBy}</p>
                <p><strong>Département:</strong> {selectedReport.department}</p>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Étape</TableHead>
                      <TableHead>Approbateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReport.approvalSteps.map((step: any) => (
                      <TableRow key={step.step}>
                        <TableCell>{step.step}</TableCell>
                        <TableCell>{step.approver}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            step.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            step.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {step.status === 'approved' ? 'Approuvé' : 
                             step.status === 'rejected' ? 'Rejeté' : 'En Attente'}
                          </Badge>
                        </TableCell>
                        <TableCell>{step.date || '-'}</TableCell>
                        <TableCell className="text-right">
                          {step.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleApproveReport(selectedReport.id, step.step)}
                              >
                                Approuver
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => handleRejectReport(selectedReport.id, step.step)}
                              >
                                Rejeter
                              </Button>
                            </div>
                          )}
                          {step.status === 'rejected' && step.reason && (
                            <span className="text-xs text-red-500">{step.reason}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setApprovalModalOpen(false)}>Fermer</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExpenseReports;
