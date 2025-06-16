
import { Badge } from "@/components/ui/badge";
import { ProjetStatus, ProjetStatusLabels, ProjetStatusColors } from "@/types/project-status";

interface ProjectStatusBadgeProps {
  status: ProjetStatus;
}

const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  return (
    <Badge className={ProjetStatusColors[status]}>
      {ProjetStatusLabels[status]}
    </Badge>
  );
};

export default ProjectStatusBadge;
