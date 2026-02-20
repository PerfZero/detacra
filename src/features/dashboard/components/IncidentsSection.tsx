import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";
import type { IncidentCard, OverdueIncidentCard } from "../types";

type IncidentsSectionProps = {
  incidentCards: IncidentCard[];
  overdueIncidentCards: OverdueIncidentCard[];
  onResolveIncident: (title: string) => void;
  onFalseIncident: (title: string) => void;
};

export const IncidentsSection = ({
  incidentCards,
  overdueIncidentCards,
  onResolveIncident,
  onFalseIncident,
}: IncidentsSectionProps) => {
  return (
    <>
      <section>
        <Card className="rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              Активные инциденты
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 xl:grid-cols-3">
              {incidentCards.map((item) => {
                const SourceIcon = item.sourceIcon;

                return (
                  <Card key={item.id} className="rounded-2xl shadow-none">
                    <CardContent className="space-y-0 p-0">
                      <div className="mb-2 flex items-center justify-between gap-3 p-6 py-0">
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Новое
                        </span>
                        <span className="text-sm text-muted-foreground">{item.timeAgo}</span>
                      </div>

                      <p className="p-6 py-1 text-lg font-semibold leading-none">{item.title}</p>

                      <div className="flex items-center justify-between gap-3 p-6 pt-2 pb-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <SourceIcon className="size-4" />
                          {item.source}
                        </span>
                        {item.location ? (
                          <span className="inline-flex items-center gap-2">
                            <Monitor className="size-4" />
                            {item.location}
                          </span>
                        ) : null}
                      </div>

                      <div className="h-[226px] overflow-hidden bg-[#F3F3F3]">
                        {item.pictureUrl ? (
                          <img
                            src={item.pictureUrl}
                            alt={item.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <p className="p-6 text-base text-muted-foreground">{item.description}</p>

                      <div className="grid grid-cols-2 gap-3 p-6 py-0">
                        <Button className="w-full" onClick={() => onResolveIncident(item.title)}>
                          Завершить
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => onFalseIncident(item.title)}
                        >
                          Ложное
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="rounded-2xl shadow-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold leading-none tracking-tight">
              Просроченные инциденты
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 xl:grid-cols-4">
              {overdueIncidentCards.map((item) => (
                <Card key={item.id} className="rounded-2xl shadow-none">
                  <CardContent className="space-y-4 px-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-base text-lg leading-none tracking-tight text-[#787878]">
                        {item.timeLabel}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#FEE2E2] px-2.5 py-1 text-xs font-medium text-[#EF4444]">
                        Просрочено
                      </span>
                    </div>

                    <p className="text-lg font-semibold leading-none">{item.title}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <Button className="w-full" onClick={() => onResolveIncident(item.title)}>
                        Завершить
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => onFalseIncident(item.title)}
                      >
                        Ложное
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};
