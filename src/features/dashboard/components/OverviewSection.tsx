import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardCheck, Sandwich } from "lucide-react";
import type { RegulationItem, StockRow, SummaryCard } from "../types";

type OverviewSectionProps = {
  summaryCards: SummaryCard[];
  regulations: RegulationItem[];
  stockRows: StockRow[];
  onOpenReplenishDialog: (row: StockRow) => void;
};

export const OverviewSection = ({
  summaryCards,
  regulations,
  stockRows,
  onOpenReplenishDialog,
}: OverviewSectionProps) => {
  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
      <div className="grid gap-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.id} className="rounded-2xl">
              <CardContent className="space-y-0 pt-0">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-lg bg-muted">
                    <Icon className="inline-flex size-10 rounded-lg bg-[#17171720] p-2" />
                  </span>
                  <span className="text-2xl leading-none tracking-tight">
                    {item.lead}
                  </span>
                  {item.badge ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      <span
                        aria-hidden
                        className="size-2 rounded-full bg-[#22C55E]"
                      />
                      {item.badge}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2 pt-4">
                  <p className="text-lg font-semibold ">{item.title}</p>
                  <p className="flex gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {item.subtitleLeft}
                    </span>{" "}
                    {item.subtitleRight}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl shadow-none">
        <CardHeader className="flex-row flex items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <span className="inline-flex rounded-lg bg-[#17171720] p-2">
              <ClipboardCheck className="size-6" />
            </span>
            Регламенты
          </CardTitle>
          <Button variant="outline" size="sm" className="rounded-md">
            Все
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {regulations.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p
                  className="text-base
font-medium "
                >
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.details}
                </p>
              </div>
              <span className="pt-0.5 whitespace-nowrap text-sm font-medium">
                {item.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="flex-row flex items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-6 text-lg font-semibold">
            <span className="inline-flex rounded-lg bg-[#17171720] p-2">
              <Sandwich className="size-6" />
            </span>
            Остаток на витрине
          </CardTitle>
          <Button variant="outline" size="sm" className="rounded-md">
            Все товары
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {stockRows.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p
                  className="truncate text-base
font-medium leading-tight"
                >
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Минимальный остаток: {item.minStock} штук
                </p>
              </div>
              <p
                className={cn(
                  "pt-0.5 whitespace-nowrap text-sm font-bold",
                  item.showcaseStock >= 10
                    ? "text-[#D2933C]"
                    : "text-[#E15241]",
                )}
              >
                {item.showcaseStock} шт.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-xl"
                onClick={() => onOpenReplenishDialog(item)}
              >
                Пополнить
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};
