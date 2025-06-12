
export interface BudgetProjetDto {
  idBudgetProjet: number;
  montantAlloue: number;
  depensesTotales: number;
  dateCreation: Date;
  dateFinProjet: Date;
  projetId: number;
  projetNom: string;
  utilisateurId: string;
  utilisateurNom: string;
}

export interface CreatedBudgetProjetDto {
  montantAlloue: number;
  projetId: number;
}

export interface UpdatedBudgetProjetDto {
  idBudgetProjet: number;
  montantAlloue: number;
}

export interface ProjetDto {
  id: number;
  nom: string;
  dateDebut: Date;
  dateFin: Date;
  departementId: number;
  responsableId: string;
}
