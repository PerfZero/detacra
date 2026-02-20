import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Flag, Pencil, Trash2 } from "lucide-react";
import type {
  NotificationMediaTone,
  NotificationRow,
  NotificationStatusTone,
} from "../types";

type NotificationsSectionProps = {
  notificationRows: NotificationRow[];
  statusToneClass: Record<NotificationStatusTone, string>;
  mediaToneClass: Record<Exclude<NotificationMediaTone, "none">, string>;
};

export const NotificationsSection = ({
  notificationRows,
  statusToneClass,
  mediaToneClass,
}: NotificationsSectionProps) => {
  return (
    <section>
      <div className="rounded-2xl border bg-card text-card-foreground shadow-none">
        <div className="block px-6 pt-6 pb-0">
          <h3 className="text-xl font-semibold leading-none tracking-tight">Уведомления</h3>
        </div>

        <div className="space-y-4 px-0 pb-4">
          <div className="border-y">
            <Table className="min-w-[1500px]">
              <TableHeader>
                <TableRow className="text-left text-sm text-muted-foreground">
                  <TableHead className="px-5 py-4 font-medium">Номер</TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Статус
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[150px] px-3 py-4 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      Рабочее место
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[230px] px-3 py-4 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      Наименование инцидента
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[260px] px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      Описание инцидента
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="min-w-[170px] px-3 py-4 font-medium whitespace-nowrap">
                    <span className="inline-flex items-center gap-2 whitespace-nowrap">
                      Дата / время
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Ответственный
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Тип
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Камера
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Медиа
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">Действие</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {notificationRows.map((row) => {
                  const TypeIcon = row.typeIcon;
                  const [datePart, timePart] = row.dateTime
                    .split("/")
                    .map((part) => part.trim());

                  return (
                    <TableRow key={row.id} className="text-sm">
                      <TableCell className="px-5 py-3 text-sm text-muted-foreground">
                        {row.id}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-medium",
                            statusToneClass[row.statusTone],
                          )}
                        >
                          {row.status === "Решено" ? <Flag className="size-3.5" /> : null}
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell className="min-w-[150px] px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {row.workplace}
                      </TableCell>
                      <TableCell className="min-w-[230px] px-3 py-3 text-sm font-semibold whitespace-nowrap">
                        {row.incidentName}
                      </TableCell>
                      <TableCell className="max-w-[280px] px-3 py-3 text-sm text-muted-foreground">
                        <p
                          className="overflow-hidden leading-5"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {row.description}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-[170px] px-3 py-3 text-sm whitespace-nowrap">
                        <span className="text-foreground">{datePart ?? row.dateTime}</span>
                        {timePart ? <span className="text-muted-foreground"> / {timePart}</span> : null}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-sm font-semibold">{row.assignee}</TableCell>
                      <TableCell className="px-3 py-3">
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="inline-flex rounded-full bg-muted p-2">
                            <TypeIcon className="size-4" />
                          </span>
                          {row.typeLabel}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-sm text-muted-foreground">
                        {row.camera}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        {row.mediaTone === "none" ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          <span
                            aria-hidden
                            className={cn("block h-8 w-14 rounded-md", mediaToneClass[row.mediaTone])}
                          />
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-5">
            <p className="text-sm text-muted-foreground">Показывать 5 из 205</p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </section>
  );
};
