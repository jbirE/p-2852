import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Plus, Filter, Eye, Mail, CalendarIcon, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ExpenseReportForm, { ExpenseFormData } from "@/components/ExpenseReportForm";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

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
  pending: <Clock className="h-4 w-4 text-amber-500" />,
};

const statusColors = {
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const ExpenseReports = () => {
  const [reports, setReports] = useState(expenseReportsData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<null | any>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  // Filter states
  const [filteredReports, setFilteredReports] = useState(expenseReportsData);
  const [filters, setFilters] = useState({
    status: "",
    department: "",
    category: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    minAmount: "",
    maxAmount: "",
    submittedBy: "",
    projectName: "",
  });
  
  // Get unique values for filters
  const departments = [...new Set(reports.map(r => r.department))];
  const categories = [...new Set(reports.map(r => r.category))];
  const submitters = [...new Set(reports.map(r => r.submittedBy))];
  const projects = [...new Set(reports.map(r => r.projectName))];
  
  // Count by status
  const approvedCount = reports.filter(r => r.status === 'approved').length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const rejectedCount = reports.filter(r => r.status === 'rejected').length;
  const totalAmount = reports.reduce((sum, r) => sum + r.amount, 0);
  
  const applyFilters = () => {
    let result = [...reports];
    
    if (filters.status) {
      result = result.filter(r => r.status === filters.status);
    }
    
    if (filters.department) {
      result = result.filter(r => r.department === filters.department);
    }
    
    if (filters.category) {
      result = result.filter(r => r.category === filters.category);
    }
    
    if (filters.submittedBy) {
      result = result.filter(r => r.submittedBy === filters.submittedBy);
    }
    
    if (filters.projectName) {
      result = result.filter(r => r.projectName === filters.projectName);
    }
    
    if (filters.startDate) {
      result = result.filter(r => new Date(r.date) >= filters.startDate!);
    }
    
    if (filters.endDate) {
      result = result.filter(r => new Date(r.date) <= filters.endDate!);
    }
    
    if (filters.minAmount && !isNaN(Number(filters.minAmount))) {
      result = result.filter(r => r.amount >= Number(filters.minAmount));
    }
    
    if (filters.maxAmount && !isNaN(Number(filters.maxAmount))) {
      result = result.filter(r => r.amount <= Number(filters.maxAmount));
    }
    
    setFilteredReports(result);
    setFilterModalOpen(false);
    toast.success(`${result.length} rapports trouvés`);
  };
  
  const resetFilters = () => {
    setFilters({
      status: "",
      department: "",
      category: "",
      startDate: null,
      endDate: null,
      minAmount: "",
      maxAmount: "",
      submittedBy: "",
      projectName: "",
    });
    setFilteredReports(reports);
    setFilterModalOpen(false);
    toast.info("Filtres réinitialisés");
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="space-y-8 p-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Gestion des Dépenses
                  </h1>
                  <p className="text-slate-600 text-lg">Centralisation et suivi des rapports de dépenses</p>
                </div>
              </div>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl" 
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouveau Rapport
            </Button>
          </div>
        </div>

        {/* Enhanced Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Total Rapports</p>
                  <h3 className="text-3xl font-bold text-slate-900">{reports.length}</h3>
                  <p className="text-xs text-emerald-600 font-medium">+12% ce mois</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Montant Total</p>
                  <h3 className="text-3xl font-bold text-slate-900">{totalAmount.toLocaleString()} DT</h3>
                  <p className="text-xs text-emerald-600 font-medium">+8% ce mois</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">En Attente</p>
                  <h3 className="text-3xl font-bold text-amber-600">{pendingCount}</h3>
                  <p className="text-xs text-amber-600 font-medium">Nécessite action</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Taux d'Approbation</p>
                  <h3 className="text-3xl font-bold text-emerald-600">{Math.round((approvedCount / reports.length) * 100)}%</h3>
                  <p className="text-xs text-emerald-600 font-medium">+5% ce mois</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-none shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Filtres et Recherche</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-300 hover:bg-slate-50 rounded-xl"
                onClick={() => setFilterModalOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres Avancés
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Rechercher par description..."
                className="bg-white border-slate-300 rounded-xl"
              />
              <Select>
                <SelectTrigger className="bg-white border-slate-300 rounded-xl">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="bg-white border-slate-300 rounded-xl">
                  <SelectValue placeholder="Filtrer par département" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">Tous les départements</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Table */}
        <Card className="bg-white border-none shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-slate-900">
                Rapports de Dépenses ({filteredReports.length})
              </CardTitle>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-300 hover:bg-slate-50">
                      <FileText className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-white border-slate-200 rounded-xl shadow-xl">
                    <div className="grid gap-2">
                      <Button variant="ghost" size="sm" className="justify-start rounded-lg" onClick={() => exportReports('excel')}>
                        Format Excel
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start rounded-lg" onClick={() => exportReports('pdf')}>
                        Format PDF
                      </Button>
                      <Button variant="ghost" size="sm" className="justify-start rounded-lg" onClick={() => exportReports('csv')}>
                        Format CSV
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-700 py-4">Rapport</TableHead>
                    <TableHead className="font-semibold text-slate-700">Description</TableHead>
                    <TableHead className="font-semibold text-slate-700">Projet</TableHead>
                    <TableHead className="font-semibold text-slate-700">Soumis Par</TableHead>
                    <TableHead className="font-semibold text-slate-700">Montant</TableHead>
                    <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">{report.id}</p>
                          <p className="text-sm text-slate-500">{report.date}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">{report.description}</p>
                          <Badge variant="outline" className="text-xs border-slate-300 text-slate-600">
                            {report.category}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">{report.projectName}</p>
                          <p className="text-sm text-slate-500">{report.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-slate-900">{report.submittedBy}</p>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-bold text-lg text-slate-900">{report.amount.toLocaleString()} DT</p>
                          {report.attachments > 0 && (
                            <p className="text-xs text-slate-500">{report.attachments} pièce(s) jointe(s)</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${statusColors[report.status as keyof typeof statusColors]} border font-medium`}
                        >
                          <span className="flex items-center gap-1.5">
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
                                className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                                onClick={() => approveOrRejectReport(report.id, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                                onClick={() => approveOrRejectReport(report.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                            onClick={() => viewApprovalWorkflow(report)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                              onClick={() => sendReminderEmail(report.id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="space-y-3">
                          <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto" />
                          <p className="text-slate-500 text-lg">Aucun rapport trouvé</p>
                          <p className="text-slate-400">Essayez d'ajuster vos filtres de recherche</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Report Form Modal */}
      <ExpenseReportForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleAddExpenseReport}
      />

      {/* Filter Dialog */}
      <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>Filtrer les Rapports de Dépense</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({...filters, status: value})}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Département</label>
              <Select
                value={filters.department}
                onValueChange={(value) => setFilters({...filters, department: value})}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Tous les départements</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({...filters, category: value})}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Projet</label>
              <Select
                value={filters.projectName}
                onValueChange={(value) => setFilters({...filters, projectName: value})}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Tous les projets" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Tous les projets</SelectItem>
                  {projects.map(proj => (
                    <SelectItem key={proj} value={proj}>{proj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Soumis Par</label>
              <Select
                value={filters.submittedBy}
                onValueChange={(value) => setFilters({...filters, submittedBy: value})}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Tous les soumetteurs" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="">Tous les soumetteurs</SelectItem>
                  {submitters.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal bg-white ${!filters.startDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(filters.startDate, "dd/MM/yyyy") : <span>Date de début</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate || undefined}
                    onSelect={(date) => setFilters({...filters, startDate: date})}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal bg-white ${!filters.endDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(filters.endDate, "dd/MM/yyyy") : <span>Date de fin</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate || undefined}
                    onSelect={(date) => setFilters({...filters, endDate: date})}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant Min (DT)</label>
              <Input
                type="number"
                placeholder="Montant minimum"
                className="bg-white"
                value={filters.minAmount}
                onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Montant Max (DT)</label>
              <Input
                type="number"
                placeholder="Montant maximum"
                className="bg-white"
                value={filters.maxAmount}
                onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={resetFilters} className="bg-white">
              Réinitialiser
            </Button>
            <Button onClick={applyFilters}>
              Appliquer les filtres
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Workflow Dialog */}
      {selectedReport && (
        <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white">
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
