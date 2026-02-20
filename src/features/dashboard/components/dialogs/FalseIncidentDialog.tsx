import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { FalseIncidentReasonOption } from "../../types";

type FalseIncidentDialogProps = {
  open: boolean;
  reasonId: string;
  reasonOptions: FalseIncidentReasonOption[];
  onChangeOpen: (isOpen: boolean) => void;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export const FalseIncidentDialog = ({
  open,
  reasonId,
  reasonOptions,
  onChangeOpen,
  onReasonChange,
  onCancel,
  onSubmit,
}: FalseIncidentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent showCloseButton={false} className="max-w-[440px] rounded-2xl border-none p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold leading-none">Инцидент ложный?</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Укажите причину, по которой инцидент считается ложным.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={reasonId} onValueChange={onReasonChange} className="space-y-1">
          {reasonOptions.map((reason) => (
            <Label
              key={reason.id}
              htmlFor={reason.id}
              className={cn(
                "w-full cursor-pointer rounded-md border px-3 py-2 text-sm font-normal transition-colors",
                reasonId === reason.id
                  ? "border-[#171717] bg-[#17171710] text-foreground"
                  : "border-input bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              <RadioGroupItem id={reason.id} value={reason.id} />
              {reason.label}
            </Label>
          ))}
        </RadioGroup>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" onClick={onCancel}>
            Отменить
          </Button>
          <Button className="w-full" onClick={onSubmit}>
            Отправить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
