
export type ProjetStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'OnHold';

export const ProjetStatusLabels: Record<ProjetStatus, string> = {
  NotStarted: 'Non Commencé',
  InProgress: 'En Cours',
  Completed: 'Terminé',
  OnHold: 'En Pause'
};

export const ProjetStatusColors: Record<ProjetStatus, string> = {
  NotStarted: 'bg-gray-100 text-gray-800',
  InProgress: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  OnHold: 'bg-yellow-100 text-yellow-800'
};
