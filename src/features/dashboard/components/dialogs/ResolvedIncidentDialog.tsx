import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ResolvedIncidentDialogProps = {
  open: boolean;
  onChangeOpen: (isOpen: boolean) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const ResolvedIncidentDialog = ({
  open,
  onChangeOpen,
  onCancel,
  onConfirm,
}: ResolvedIncidentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent showCloseButton={false} className="max-w-[520px] rounded-2xl border-none p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold leading-none">Инцидент решен?</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Нажимая «Решён», вы подтверждаете, что инцидент устранён и дальнейших действий не требуется.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={onCancel}>
            Отменить
          </Button>
          <Button className="w-full" onClick={onConfirm}>
            Решен
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
