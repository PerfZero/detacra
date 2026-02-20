import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import type { StockRow } from "../../types";

type ReplenishDialogProps = {
  open: boolean;
  selectedStockRow: StockRow | null;
  replenishValue: number;
  onChangeOpen: (isOpen: boolean) => void;
  onValueChange: (value: number[]) => void;
  onClose: () => void;
};

export const ReplenishDialog = ({
  open,
  selectedStockRow,
  replenishValue,
  onChangeOpen,
  onValueChange,
  onClose,
}: ReplenishDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className="w-[374px] max-w-[calc(100%-2rem)] rounded-2xl border-none p-6">
        <DialogHeader className="pr-10">
          <DialogTitle className="text-2xl font-semibold leading-none">Пополнить</DialogTitle>
          <DialogDescription className="pt-2 text-lg leading-7 text-[#787878]">
            {selectedStockRow?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-2 pb-4 text-center text-6xl leading-none font-semibold text-foreground">
          {replenishValue}
        </div>

        <Slider
          min={1}
          max={20}
          step={1}
          value={[replenishValue]}
          onValueChange={onValueChange}
          className="w-full [&_[data-slot=slider-thumb]]:border-[#171717] [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:size-6 [&_[data-slot=slider-track]]:h-2.5 [&_[data-slot=slider-track]]:bg-[#ECECEC] [&_[data-slot=slider-range]]:bg-[#171717]"
        />

        <div className="flex items-center justify-between text-base text-[#787878]">
          <span>min: 1</span>
          <span>max: 20</span>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between text-base">
            <span className="text-[#787878]">Остаток на складе</span>
            <span className="font-semibold text-foreground">
              {selectedStockRow?.warehouseStock ?? "—"}
            </span>
          </div>

          <div className="flex items-center justify-between text-base">
            <span className="text-[#787878]">Витрина</span>
            <span className="font-semibold text-foreground">
              {selectedStockRow?.showcaseStock ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between text-base">
            <span className="text-[#787878]">Минимальный остаток</span>
            <span className="text-[#787878]">{selectedStockRow?.minStock ?? 0}</span>
          </div>
        </div>

        <Button className="mt-3 h-12 w-full rounded-xl text-lg" onClick={onClose}>
          Пополнить
        </Button>
      </DialogContent>
    </Dialog>
  );
};
