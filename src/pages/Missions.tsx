
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Users, MapPin, Calendar, Euro } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mission, EmployeGrade } from "@/types/mission";

// Grades des employés avec taux
const employeGrades: EmployeGrade[] = [
  { id: 1, nom: "Junior", tauxEuro: 200, tauxTND: 650, niveau: 1 },
  { id: 2, nom: "Intermédiaire", tauxEuro: 350, tauxTND: 1130, niveau: 2 },
  { id: 3, nom: "Senior", tauxEuro: 500, tauxTND: 1620, niveau: 3 },
  { id: 4, nom: "Expert", tauxEuro: 700, tauxTND: 2270, niveau: 4 },
  { id: 5, nom: "Lead", tauxEuro: 900, tauxTND: 2920, niveau: 5 },
];

// Données de démonstration
const initialMissions: Mission[] = [
  {
    id: 1,
    nom: "Audit Système Client Alpha",
    projetId: 1,
    projetNom: "Audit Client XYZ 2025",
    dateDebut: new Date("2025-02-01"),
    dateFin: new Date("2025-03-15"),
    region: 'local',
    montantAlloue: 15000,
    revenuTotal: 18000,
    depensesTotales: 12000,
    status: 'en_cours',
    description: "Mission d'audit des systèmes informatiques",
    equipe: [
      {
        id: 1,
        employeId: "EMP-001",
        employeNom: "Ahmed Ben Ali",
        grade: employeGrades[2],
        tauxJournalier: 500,
        nombreJours: 20,
        montantTotal: 10000,
        typeCharge: 'salaire',
        dateAffectation: new Date("2025-02-01")
      },
      {
        id: 2,
        employeId: "EMP-002",
        employeNom: "Fatma Trabelsi",
        grade: employeGrades[1],
        tauxJournalier: 350,
        nombreJours: 15,
        montantTotal: 5250,
        typeCharge: 'salaire',
        dateAffectation: new Date("2025-02-01")
      }
    ]
  },
  {
    id: 2,
    nom: "Formation Cloud Paris",
    projetId: 2,
    projetNom: "Migration Système",
    dateDebut: new Date("2025-03-01"),
    dateFin: new Date("2025-03-05"),
    region: 'etranger',
    montantAlloue: 8000,
    revenuTotal: 0,
    depensesTotales: 6500,
    status: 'planifiee',
    description: "Formation sur les technologies cloud à Paris",
    equipe: [
      {
        id: 3,
        employeId: "EMP-003",
        employeNom: "Mohamed Nasri",
        grade: employeGrades[3],
        tauxJournalier: 70,
        nombreJours: 5,
        montantTotal: 350,
        typeCharge: 'formation',
        dateAffectation: new Date("2025-03-01")
      }
    ]
  }
];

// Projets disponibles
const projetsDisponibles = [
  { id: 1, nom: "Audit Client XYZ 2025" },
  { id: 2, nom: "Migration Système" },
  { id: 3, nom: "Étude de Marché" },
  { id: 4, nom: "Développement CRM" },
];

const StatusBadge = ({ status }: { status: Mission['status'] }) => {
  const variants = {
    planifiee: "bg-blue-100 text-blue-800",
    en_cours: "bg-green-100 text-green-800",
    terminee: "bg-gray-100 text-gray-800",
    suspendue: "bg-red-100 text-red-800",
  };
  
  const labels = {
    planifiee: "Planifiée",
    en_cours: "En Cours",
    terminee: "Terminée",
    suspendue: "Suspendue",
  };
  
  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

const RegionBadge = ({ region }: { region: Mission['region'] }) => {
  return (
    <Badge variant={region === 'local' ? 'secondary' : 'outline'}>
      <MapPin className="w-3 h-3 mr-1" />
      {region === 'local' ? 'Local' : 'Étranger'}
    </Badge>
  );
};

const Missions = () => {
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState<number | null>(null);

  const handleDeleteMission = () => {
    if (missionToDelete) {
      setMissions(missions.filter(m => m.id !== missionToDelete));
      toast.success("Mission supprimée avec succès");
      setIsDeleteDialogOpen(false);
      setMissionToDelete(null);
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setMissionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

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

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.projetNom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || mission.status === statusFilter;
    const matchesRegion = regionFilter === "all" || mission.region === regionFilter;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRegionFilter("all");
  };

  // Calculs des métriques
  const totalMissions = missions.length;
  const missionsActives = missions.filter(m => m.status === 'en_cours').length;
  const revenuTotal = missions.reduce((sum, m) => sum + m.revenuTotal, 0);
  const depensesTotales = missions.reduce((sum, m) => sum + m.depensesTotales, 0);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary">Gestion des Missions</h1>
          <p className="text-secondary-foreground">Gérer les missions par projet avec leurs équipes et revenus</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Mission
        </Button>
      </header>

      {/* Métriques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Missions</p>
                <p className="text-2xl font-bold">{totalMissions}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Missions Actives</p>
                <p className="text-2xl font-bold text-green-600">{missionsActives}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenus Totaux</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(revenuTotal)}</p>
              </div>
              <Euro className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dépenses Totales</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(depensesTotales)}</p>
              </div>
              <Euro className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rechercher</label>
              <Input
                placeholder="Nom de mission ou projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="planifiee">Planifiée</SelectItem>
                  <SelectItem value="en_cours">En Cours</SelectItem>
                  <SelectItem value="terminee">Terminée</SelectItem>
                  <SelectItem value="suspendue">Suspendue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Région</label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les régions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="etranger">Étranger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={clearFilters}>
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des missions */}
      <Card>
        <CardHeader>
          <CardTitle>Missions ({filteredMissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mission</TableHead>
                  <TableHead>Projet</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Équipe</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Revenus</TableHead>
                  <TableHead>Dépenses</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMissions.map((mission) => (
                  <TableRow key={mission.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{mission.nom}</p>
                        {mission.description && (
                          <p className="text-sm text-muted-foreground">{mission.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{mission.projetNom}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(mission.dateDebut)}</p>
                        <p className="text-muted-foreground">au {formatDate(mission.dateFin)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RegionBadge region={mission.region} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{mission.equipe.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(mission.montantAlloue)}</TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(mission.revenuTotal)}
                    </TableCell>
                    <TableCell className="text-orange-600 font-medium">
                      {formatCurrency(mission.depensesTotales)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={mission.status} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleOpenDeleteDialog(mission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Aucune mission trouvée avec les filtres actuels
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement la mission et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMission} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Missions;
