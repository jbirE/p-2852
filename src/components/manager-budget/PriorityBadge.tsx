
import { Badge } from "@/components/ui/badge";

export type ProjectPriority = 'high' | 'medium' | 'low';

interface PriorityBadgeProps {
  priority: ProjectPriority;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const variants = {
    'high': "bg-red-50 text-red-700 border-red-200",
    'medium': "bg-yellow-50 text-yellow-700 border-yellow-200",
    'low': "bg-gray-50 text-gray-700 border-gray-200",
  };

  const labels = {
    'high': "Haute",
    'medium': "Moyenne",
    'low': "Basse",
  };

  return (
    <Badge variant="outline" className={variants[priority]}>
      {labels[priority]}
    </Badge>
  );
};

export default PriorityBadge;
