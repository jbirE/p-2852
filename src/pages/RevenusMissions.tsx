
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Euro, TrendingUp, Calendar, MapPin } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RevenuMission, EmployeGrade } from "@/types/mission";

// Grades des employés avec taux
const employeGrades: EmployeGrade[] = [
  { id: 1, nom: "Junior", tauxEuro: 200, tauxTND: 650, niveau: 1 },
  { id: 2, nom: "Intermédiaire", tauxEuro: 350, tauxTND: 1130, niveau: 2 },
  { id: 3, nom: "Senior", tauxEuro: 500, tauxTND: 1620, niveau: 3 },
  { id: 4, nom: "Expert", tauxEuro: 700, tauxTND: 2270, niveau: 4 },
  { id: 5, nom: "Lead", tauxEuro: 900, tauxTND: 2920, niveau: 5 },
];

// Données de démonstration
const initialRevenus: RevenuMission[] = [
  {
    id: 1,
    missionId: 1,
    missionNom: "Audit Système Client Alpha",
    montantRevenu: 18000,
    dateRevenu: new Date("2025-02-15"),
    description: "Paiement première phase audit",
    factureReference: "FAC-2025-001"
  },
  {
    id: 2,
    missionId: 1,
    missionNom: "Audit Système Client Alpha",
    montantRevenu: 5000,
    dateRevenu: new Date("2025-03-01"),
    description: "Bonus performance équipe",
    factureReference: "FAC-2025-002"
  },
  {
    id: 3,
    missionId: 2,
    missionNom: "Formation Cloud Paris",
    montantRevenu: 12000,
    dateRevenu: new Date("2025-03-10"),
    description: "Revenus formation certifiée",
    factureReference: "FAC-2025-003"
  }
];

const RevenusMissions = () => {
  const [revenus, setRevenus] = useState<RevenuMission[]>(initialRevenus);
  const [searchTerm, setSearchTerm] = useState("");
  const [missionFilter, setMissionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const formatCurrency = (amount: number, currency: 'EUR' | 'TND' = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const convertToTND = (euroAmount: number) => {
    const exchangeRate = 3.24; // Taux EUR -> TND approximatif
    return euroAmount * exchangeRate;
  };

  const filteredRevenus = revenus.filter(revenu => {
    const matchesSearch = revenu.missionNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         revenu.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         revenu.factureReference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMission = missionFilter === "all" || revenu.missionId.toString() === missionFilter;
    
    return matchesSearch && matchesMission;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setMissionFilter("all");
    setDateFilter("all");
  };

  // Calculs des métriques
  const revenuTotal = revenus.reduce((sum, r) => sum + r.montantRevenu, 0);
  const revenuMoyenParMission = revenus.length > 0 ? revenuTotal / revenus.length : 0;
  const nombreFactures = revenus.length;
  const dernierRevenu = revenus.sort((a, b) => b.dateRevenu.getTime() - a.dateRevenu.getTime())[0];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Revenus par Mission</h1>
          <p className="text-secondary-foreground">Suivi des revenus générés par chaque mission avec détails des équipes</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Revenu
        </Button>
      </header>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus Totaux</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(revenuTotal)}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(convertToTND(revenuTotal), 'TND')}</p>
              </div>
              <Euro className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenu Moyen</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(revenuMoyenParMission)}</p>
                <p className="text-sm text-muted-foreground">par mission</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre de Factures</p>
                <p className="text-2xl font-bold">{nombreFactures}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dernier Revenu</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dernierRevenu ? formatCurrency(dernierRevenu.montantRevenu) : "0 €"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dernierRevenu ? formatDate(dernierRevenu.dateRevenu) : "Aucun"}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des Taux par Grade */}
      <Card>
        <CardHeader>
          <CardTitle>Taux par Grade d'Employé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {employeGrades.map((grade) => (
              <Card key={grade.id} className="p-4">
                <div className="text-center">
                  <Badge variant="outline" className="mb-2">
                    Niveau {grade.niveau}
                  </Badge>
                  <h3 className="font-semibold text-lg">{grade.nom}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-blue-600 font-medium">
                      {formatCurrency(grade.tauxEuro)}/jour
                    </p>
                    <p className="text-sm text-orange-600 font-medium">
                      {formatCurrency(grade.tauxTND, 'TND')}/jour
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <Input
                placeholder="Mission, description, facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Mission</label>
              <Select value={missionFilter} onValueChange={setMissionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les missions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les missions</SelectItem>
                  <SelectItem value="1">Audit Système Client Alpha</SelectItem>
                  <SelectItem value="2">Formation Cloud Paris</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="current_month">Ce mois</SelectItem>
                  <SelectItem value="last_month">Mois dernier</SelectItem>
                  <SelectItem value="current_year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={clearFilters}>
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des revenus */}
      <Card>
        <CardHeader>
          <CardTitle>Détail des Revenus ({filteredRevenus.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mission</TableHead>
                  <TableHead>Montant (EUR)</TableHead>
                  <TableHead>Montant (TND)</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Référence Facture</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRevenus.map((revenu) => (
                  <TableRow key={revenu.id}>
                    <TableCell>
                      <div className="font-medium">{revenu.missionNom}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-green-600">
                        {formatCurrency(revenu.montantRevenu)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-orange-600">
                        {formatCurrency(convertToTND(revenu.montantRevenu), 'TND')}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(revenu.dateRevenu)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {revenu.description || "—"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {revenu.factureReference || "—"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRevenus.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun revenu trouvé avec les filtres actuels
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenusMissions;
