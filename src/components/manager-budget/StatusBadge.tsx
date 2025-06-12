
import { Badge } from "@/components/ui/badge";

export type ProjectStatus = 'active' | 'completed' | 'on-hold' | 'over-budget';

interface StatusBadgeProps {
  status: ProjectStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variants = {
    'active': "bg-green-100 text-green-800",
    'completed': "bg-blue-100 text-blue-800",
    'on-hold': "bg-yellow-100 text-yellow-800",
    'over-budget': "bg-red-100 text-red-800",
  };

  const labels = {
    'active': "Actif",
    'completed': "Terminé",
    'on-hold': "En Pause",
    'over-budget': "Dépassé",
  };

  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
};

export default StatusBadge;
