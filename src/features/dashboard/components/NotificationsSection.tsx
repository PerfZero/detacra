import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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

type SortDirection = "asc" | "desc";
type SortField =
  | "id"
  | "status"
  | "workplace"
  | "incidentName"
  | "description"
  | "dateTime"
  | "assignee"
  | "typeLabel"
  | "camera";

const PAGE_SIZE = 5;

const parseRowId = (value: string) => {
  const parsed = Number.parseInt(value.replaceAll("#", ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const compareText = (left: string, right: string) =>
  left.localeCompare(right, "ru", { sensitivity: "base" });

const buildPageNumbers = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
};

export const NotificationsSection = ({
  notificationRows,
  statusToneClass,
  mediaToneClass,
}: NotificationsSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedRows = useMemo(() => {
    const rows = [...notificationRows];
    const direction = sortDirection === "asc" ? 1 : -1;

    rows.sort((left, right) => {
      if (sortField === "id") {
        return (parseRowId(left.id) - parseRowId(right.id)) * direction;
      }

      const leftValue = left[sortField];
      const rightValue = right[sortField];

      if (typeof leftValue === "string" && typeof rightValue === "string") {
        return compareText(leftValue, rightValue) * direction;
      }

      return 0;
    });

    return rows;
  }, [notificationRows, sortDirection, sortField]);

  const totalItems = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = sortedRows.slice(startIndex, startIndex + PAGE_SIZE);
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortDirection, sortField, notificationRows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  const renderSortableHeader = (
    label: string,
    field: SortField,
    className?: string,
  ) => (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap text-left",
        className,
      )}
      onClick={() => handleSortChange(field)}
      aria-label={`Сортировать по полю ${label}`}
    >
      {label}
      <ArrowUpDown
        className={cn(
          "size-4",
          sortField === field ? "text-foreground" : "text-muted-foreground",
        )}
      />
    </button>
  );

  return (
    <section>
      <div className="rounded-2xl border bg-card text-card-foreground shadow-none">
        <div className="block px-6 pt-6 pb-6">
          <h3 className="text-xl font-semibold leading-none tracking-tight">
            Уведомления
          </h3>
        </div>

        <div className="space-y-4 px-0 pb-4">
          <div className="border-y">
            <Table className="min-w-[1500px]">
              <TableHeader>
                <TableRow className="text-left text-sm text-muted-foreground">
                  <TableHead className="px-5 py-4 font-medium">Номер</TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    {renderSortableHeader("Статус", "status")}
                  </TableHead>
                  <TableHead className="min-w-[150px] px-3 py-4 font-medium whitespace-nowrap">
                    {renderSortableHeader("Рабочее место", "workplace")}
                  </TableHead>
                  <TableHead className="min-w-[230px] px-3 py-4 font-medium whitespace-nowrap">
                    {renderSortableHeader(
                      "Наименование инцидента",
                      "incidentName",
                    )}
                  </TableHead>
                  <TableHead className="min-w-[260px] px-3 py-4 font-medium">
                    {renderSortableHeader("Описание инцидента", "description")}
                  </TableHead>
                  <TableHead className="min-w-[170px] px-3 py-4 font-medium whitespace-nowrap">
                    {renderSortableHeader("Дата / время", "dateTime")}
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    {renderSortableHeader("Ответственный", "assignee")}
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    {renderSortableHeader("Тип", "typeLabel")}
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    {renderSortableHeader("Камера", "camera")}
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    <span className="inline-flex items-center gap-2">
                      Медиа
                      <ArrowUpDown className="size-4" />
                    </span>
                  </TableHead>
                  <TableHead className="px-3 py-4 font-medium">
                    Действие
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row) => {
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
                          {row.status === "Решено" ? (
                            <Flag className="size-3.5" />
                          ) : null}
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
                        <span className="text-foreground">
                          {datePart ?? row.dateTime}
                        </span>
                        {timePart ? (
                          <span className="text-muted-foreground">
                            {" "}
                            / {timePart}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-sm font-semibold">
                        {row.assignee}
                      </TableCell>
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
                            className={cn(
                              "block h-8 w-14 rounded-md",
                              mediaToneClass[row.mediaTone],
                            )}
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
            <p className="text-sm text-muted-foreground">
              Показывать {pageRows.length} из {totalItems}
            </p>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((previous) => Math.max(1, previous - 1));
                    }}
                  />
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                  <PaginationItem key={`${page}-${index}`}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentPage((previous) =>
                        Math.min(totalPages, previous + 1),
                      );
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </section>
  );
};
