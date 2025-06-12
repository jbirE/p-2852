
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { BudgetProjetDto, CreatedBudgetProjetDto, UpdatedBudgetProjetDto, ProjetDto } from "@/types/budget-projet";

interface BudgetProjetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreatedBudgetProjetDto | UpdatedBudgetProjetDto) => void;
  editData?: BudgetProjetDto;
  availableProjects: ProjetDto[];
}

const BudgetProjetFormModal = ({
  isOpen,
  onClose,
  onSave,
  editData,
  availableProjects
}: BudgetProjetFormModalProps) => {
  const [formData, setFormData] = useState({
    montantAlloue: 0,
    projetId: 0
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        montantAlloue: editData.montantAlloue,
        projetId: editData.projetId
      });
    } else {
      setFormData({
        montantAlloue: 0,
        projetId: 0
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.montantAlloue <= 0) {
      toast.error("Le montant alloué doit être positif");
      return;
    }

    if (formData.projetId === 0) {
      toast.error("Veuillez sélectionner un projet");
      return;
    }

    if (editData) {
      const updateData: UpdatedBudgetProjetDto = {
        idBudgetProjet: editData.idBudgetProjet,
        montantAlloue: formData.montantAlloue
      };
      onSave(updateData);
    } else {
      const createData: CreatedBudgetProjetDto = {
        montantAlloue: formData.montantAlloue,
        projetId: formData.projetId
      };
      onSave(createData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Modifier Budget Projet' : 'Créer Budget Projet'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="montantAlloue">Montant Alloué (DT)</Label>
            <Input
              id="montantAlloue"
              type="number"
              min="0"
              step="0.01"
              value={formData.montantAlloue}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                montantAlloue: parseFloat(e.target.value) || 0
              }))}
              required
            />
          </div>

          {!editData && (
            <div className="space-y-2">
              <Label htmlFor="projetId">Projet</Label>
              <Select
                value={formData.projetId.toString()}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  projetId: parseInt(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un projet" />
                </SelectTrigger>
                <SelectContent>
                  {availableProjects.map((projet) => (
                    <SelectItem key={projet.id} value={projet.id.toString()}>
                      {projet.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {editData ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetProjetFormModal;
