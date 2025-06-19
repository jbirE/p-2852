
export interface Mission {
  id: number;
  nom: string;
  projetId: number;
  projetNom: string;
  dateDebut: Date;
  dateFin: Date;
  region: 'local' | 'etranger';
  montantAlloue: number;
  revenuTotal: number;
  depensesTotales: number;
  status: 'planifiee' | 'en_cours' | 'terminee' | 'suspendue';
  description?: string;
  equipe: EmployeMission[];
}

export interface EmployeMission {
  id: number;
  employeId: string;
  employeNom: string;
  grade: EmployeGrade;
  tauxJournalier: number;
  nombreJours: number;
  montantTotal: number;
  typeCharge: 'salaire' | 'formation' | 'transport' | 'hebergement' | 'autre';
  dateAffectation: Date;
}

export interface EmployeGrade {
  id: number;
  nom: string;
  tauxEuro: number;
  tauxTND: number;
  niveau: number;
}

export interface RevenuMission {
  id: number;
  missionId: number;
  missionNom: string;
  montantRevenu: number;
  dateRevenu: Date;
  description?: string;
  factureReference?: string;
}

export interface CreateMissionDto {
  nom: string;
  projetId: number;
  dateDebut: Date;
  dateFin: Date;
  region: 'local' | 'etranger';
  montantAlloue: number;
  revenuTotal: number;
  description?: string;
}

export interface CreateEmployeMissionDto {
  employeId: string;
  employeNom: string;
  gradeId: number;
  nombreJours: number;
  typeCharge: 'salaire' | 'formation' | 'transport' | 'hebergement' | 'autre';
}
