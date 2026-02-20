import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ArrowDownToLine,
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronsUpDown,
  Search,
  Upload,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ru } from "date-fns/locale";
import type {
  NotificationMediaTone,
  NotificationRow,
  NotificationStatusTone,
} from "../types";

type NotificationsPageSectionProps = {
  notificationRows: NotificationRow[];
  statusToneClass: Record<NotificationStatusTone, string>;
  mediaToneClass: Record<Exclude<NotificationMediaTone, "none">, string>;
};

type SortDirection = "asc" | "desc";
type SortField =
  | "id"
  | "dateTime"
  | "incidentName"
  | "description"
  | "status"
  | "camera"
  | "workplace"
  | "typeLabel"
  | "assignee";

type MultiSelectOption = {
  value: string;
  label: string;
  toneClass?: string;
  icon?: LucideIcon;
};

type MultiSelectDropdownProps = {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
};

type PeriodDropdownProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
};

const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const parseRowId = (value: string) => {
  const parsed = Number.parseInt(value.replaceAll("#", ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseDateTime = (value: string) => {
  const [datePart, timePart] = value.split("/").map((part) => part.trim());

  if (!datePart || datePart === "—") {
    return null;
  }

  const [dayString, monthString, yearString] = datePart.split(".");
  const day = Number(dayString);
  const month = Number(monthString);
  const yearShort = Number(yearString);

  if (
    !Number.isFinite(day) ||
    !Number.isFinite(month) ||
    !Number.isFinite(yearShort)
  ) {
    return null;
  }

  const fullYear = yearShort < 100 ? 2000 + yearShort : yearShort;
  const [hourString = "0", minuteString = "0"] = (timePart ?? "").split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);
  const date = new Date(fullYear, month - 1, day, hour, minute);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

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

const MultiSelectDropdown = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const allSelected =
    options.length > 0 && selectedValues.length === options.length;
  const selectedOptionLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label);

  const triggerLabel =
    selectedOptionLabels.length === 0
      ? placeholder
      : allSelected
        ? "Все"
        : selectedOptionLabels.length === 1
          ? selectedOptionLabels[0]
          : `${selectedOptionLabels[0]} +${selectedOptionLabels.length - 1}`;

  const handleSelectAll = () => {
    if (allSelected) {
      onChange([]);
      return;
    }

    onChange(options.map((option) => option.value));
  };

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onChange([...selectedValues, value]);
  };

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="h-10 w-full justify-between font-normal"
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandList>
              <CommandEmpty>Ничего не найдено</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={handleSelectAll}
                  value="select-all"
                  className="data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
                >
                  <Checkbox
                    checked={allSelected}
                    className="pointer-events-none"
                  />
                  <span className="font-medium">Выбрать все</span>
                </CommandItem>

                {options.map((option) => {
                  const OptionIcon = option.icon;
                  const isChecked = selectedValues.includes(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => toggleValue(option.value)}
                      className="data-[selected=true]:bg-transparent data-[selected=true]:text-foreground"
                    >
                      <Checkbox
                        checked={isChecked}
                        className="pointer-events-none"
                      />

                      {option.toneClass ? (
                        <Badge className={cn("font-medium", option.toneClass)}>
                          {option.label}
                        </Badge>
                      ) : OptionIcon ? (
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="inline-flex rounded-full bg-muted p-1.5">
                            <OptionIcon className="size-4" />
                          </span>
                          {option.label}
                        </span>
                      ) : (
                        <span>{option.label}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const PeriodDropdown = ({
  selectedDate,
  onSelectDate,
}: PeriodDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState<Date>(selectedDate ?? new Date());

  useEffect(() => {
    if (selectedDate) {
      setMonth(selectedDate);
    }
  }, [selectedDate]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, index) => currentYear - 5 + index);
  }, []);

  const monthValue = String(month.getMonth());
  const yearValue = String(month.getFullYear());

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">По периоду</p>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 w-full justify-between font-normal"
          >
            <span className={cn(!selectedDate && "text-muted-foreground")}>
              {selectedDate
                ? selectedDate.toLocaleDateString("ru-RU")
                : "Выбрать период"}
            </span>
            <CalendarDays className="size-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3" align="end">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Select
              value={monthValue}
              onValueChange={(value) =>
                setMonth(new Date(month.getFullYear(), Number(value), 1))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_NAMES.map((name, index) => (
                  <SelectItem key={name} value={String(index)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={yearValue}
              onValueChange={(value) =>
                setMonth(new Date(Number(value), month.getMonth(), 1))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selectedDate ?? undefined}
            onSelect={(date) => {
              onSelectDate(date ?? null);
              setIsOpen(false);
            }}
            locale={ru}
            weekStartsOn={1}
            className="rounded-md border p-0"
            classNames={{
              month_caption: "hidden",
              nav: "hidden",
            }}
          />

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              className="h-8 px-2 text-sm"
              onClick={() => {
                onSelectDate(null);
                setIsOpen(false);
              }}
            >
              Очистить
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const NotificationsPageSection = ({
  notificationRows,
  statusToneClass,
  mediaToneClass,
}: NotificationsPageSectionProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [falseIncidentTarget, setFalseIncidentTarget] = useState<string | null>(
    null,
  );
  const [falseIncidentReason, setFalseIncidentReason] = useState("");
  const [resolvedIncidentTarget, setResolvedIncidentTarget] = useState<
    string | null
  >(null);

  const statusToneByLabel = useMemo(() => {
    const toneMap = new Map<string, NotificationStatusTone>();

    notificationRows.forEach((row) => {
      toneMap.set(row.status, row.statusTone);
    });

    return toneMap;
  }, [notificationRows]);

  const statusOptions = useMemo<MultiSelectOption[]>(() => {
    return [...new Set(notificationRows.map((row) => row.status))].map(
      (status) => {
        const tone = statusToneByLabel.get(status);

        return {
          value: status,
          label: status,
          toneClass: tone
            ? statusToneClass[tone]
            : "bg-muted text-muted-foreground",
        };
      },
    );
  }, [notificationRows, statusToneByLabel, statusToneClass]);

  const typeOptions = useMemo<MultiSelectOption[]>(() => {
    const uniqueByType = new Map<string, NotificationRow>();

    notificationRows.forEach((row) => {
      if (!uniqueByType.has(row.typeLabel)) {
        uniqueByType.set(row.typeLabel, row);
      }
    });

    return Array.from(uniqueByType.values()).map((row) => ({
      value: row.typeLabel,
      label: row.typeLabel,
      icon: row.typeIcon,
    }));
  }, [notificationRows]);

  useEffect(() => {
    if (statusOptions.length) {
      setSelectedStatuses(statusOptions.map((option) => option.value));
    }
  }, [statusOptions]);

  useEffect(() => {
    if (typeOptions.length) {
      setSelectedTypes(typeOptions.map((option) => option.value));
    }
  }, [typeOptions]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return notificationRows.filter((row) => {
      if (!selectedStatuses.length || !selectedStatuses.includes(row.status)) {
        return false;
      }

      if (!selectedTypes.length || !selectedTypes.includes(row.typeLabel)) {
        return false;
      }

      if (selectedDate) {
        const rowDate = parseDateTime(row.dateTime);
        if (!rowDate || !isSameDay(rowDate, selectedDate)) {
          return false;
        }
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        row.id,
        row.incidentName,
        row.description,
        row.assignee,
        row.camera,
        row.workplace,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [
    notificationRows,
    searchValue,
    selectedDate,
    selectedStatuses,
    selectedTypes,
  ]);

  const sortedRows = useMemo(() => {
    const rows = [...filteredRows];
    const direction = sortDirection === "asc" ? 1 : -1;

    rows.sort((left, right) => {
      if (sortField === "id") {
        return (parseRowId(left.id) - parseRowId(right.id)) * direction;
      }

      if (sortField === "dateTime") {
        const leftTime = parseDateTime(left.dateTime)?.getTime() ?? 0;
        const rightTime = parseDateTime(right.dateTime)?.getTime() ?? 0;
        return (leftTime - rightTime) * direction;
      }

      const leftValue = left[sortField];
      const rightValue = right[sortField];

      if (typeof leftValue === "string" && typeof rightValue === "string") {
        return compareText(leftValue, rightValue) * direction;
      }

      return 0;
    });

    return rows;
  }, [filteredRows, sortDirection, sortField]);

  const totalItems = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = sortedRows.slice(startIndex, startIndex + pageSize);
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    pageSize,
    searchValue,
    selectedDate?.getTime(),
    selectedStatuses,
    selectedTypes,
    sortDirection,
    sortField,
  ]);

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

  const renderSortableHeader = (label: string, field: SortField) => (
    <button
      type="button"
      className="inline-flex items-center gap-2 whitespace-nowrap text-left"
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
      <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-none">
        <div className="border-b px-6 py-5">
          <h2 className="text-xl font-semibold tracking-tight">Уведомления</h2>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <MultiSelectDropdown
              label="По статусу"
              options={statusOptions}
              selectedValues={selectedStatuses}
              onChange={setSelectedStatuses}
              placeholder="Все"
            />

            <MultiSelectDropdown
              label="По типу"
              options={typeOptions}
              selectedValues={selectedTypes}
              onChange={setSelectedTypes}
              placeholder="Все"
            />

            <PeriodDropdown
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
          <div className="relative w-full max-w-[340px]">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Быстрый поиск..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[72px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="secondary" className="gap-2">
              <Upload className="size-4" />
              Импорт
            </Button>
            <Button variant="secondary" className="gap-2">
              <ArrowDownToLine className="size-4" />
              Экспорт
            </Button>
          </div>
        </div>

        <div className="border-b">
          <Table className="min-w-[1500px]">
            <TableHeader>
              <TableRow className="text-left text-sm text-muted-foreground">
                <TableHead className="px-5 py-4 font-medium">
                  {renderSortableHeader("Номер", "id")}
                </TableHead>
                <TableHead className="px-3 py-4 font-medium">
                  {renderSortableHeader("Дата / время", "dateTime")}
                </TableHead>
                <TableHead className="min-w-[230px] px-3 py-4 font-medium">
                  {renderSortableHeader(
                    "Наименование инцидента",
                    "incidentName",
                  )}
                </TableHead>
                <TableHead className="min-w-[260px] px-3 py-4 font-medium">
                  {renderSortableHeader("Описание инцидента", "description")}
                </TableHead>
                <TableHead className="px-3 py-4 font-medium">
                  {renderSortableHeader("Статус", "status")}
                </TableHead>
                <TableHead className="px-3 py-4 font-medium">
                  {renderSortableHeader("Камера", "camera")}
                </TableHead>
                <TableHead className="px-3 py-4 font-medium">
                  {renderSortableHeader("Рабочее место", "workplace")}
                </TableHead>
                <TableHead className="px-3 py-4 font-medium">Медиа</TableHead>
                <TableHead className="px-3 py-4 font-medium">
                  {renderSortableHeader("Тип", "typeLabel")}
                </TableHead>
                <TableHead className="px-3 py-4 font-medium">
                  {renderSortableHeader("Ответственный", "assignee")}
                </TableHead>
                <TableHead className="px-3 py-4 font-medium" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageRows.map((row) => {
                const TypeIcon = row.typeIcon;
                const [datePart, timePart] = row.dateTime
                  .split("/")
                  .map((part) => part.trim());

                return (
                  <TableRow key={row.id}>
                    <TableCell className="px-5 py-3 text-sm text-muted-foreground">
                      {row.id}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm whitespace-nowrap">
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
                    <TableCell className="px-3 py-3">
                      <Badge
                        className={cn(
                          "rounded-md",
                          statusToneClass[row.statusTone],
                        )}
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm text-muted-foreground">
                      {row.camera}
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm text-muted-foreground">
                      {row.workplace}
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
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex rounded-full bg-muted p-2">
                          <TypeIcon className="size-4" />
                        </span>
                        {row.typeLabel}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-3 text-sm font-semibold">
                      {row.assignee}
                    </TableCell>
                    <TableCell className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          className="bg-black text-white hover:bg-black/90"
                          onClick={() =>
                            setResolvedIncidentTarget(row.incidentName)
                          }
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="bg-[#D95D56] text-white hover:bg-[#D95D56]/90"
                          onClick={() => {
                            setFalseIncidentTarget(row.incidentName);
                            setFalseIncidentReason("");
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-6 py-3.5">
          <p className="text-sm text-muted-foreground">
            Показывать {pageRows.length} из {totalItems}
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50",
                  )}
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
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50",
                  )}
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

      <Dialog
        open={Boolean(falseIncidentTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setFalseIncidentTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-[560px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Инцидент ложный?</DialogTitle>
            <DialogDescription>
              Укажите причину, по которой инцидент считается ложным.
            </DialogDescription>
          </DialogHeader>

          <textarea
            value={falseIncidentReason}
            onChange={(event) => setFalseIncidentReason(event.target.value)}
            placeholder="Введите текст"
            className="border-input min-h-28 w-full resize-y rounded-xl border bg-background px-4 py-3 text-base shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setFalseIncidentTarget(null);
                setFalseIncidentReason("");
              }}
            >
              Отменить
            </Button>
            <Button
              onClick={() => {
                setFalseIncidentTarget(null);
                setFalseIncidentReason("");
              }}
            >
              Отправить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(resolvedIncidentTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setResolvedIncidentTarget(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[620px] rounded-2xl p-6"
        >
          <DialogHeader>
            <DialogTitle>Инцидент решен?</DialogTitle>
            <DialogDescription>
              Нажимая «Решён», вы подтверждаете, что инцидент устранён и
              дальнейших действий не требуется.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setResolvedIncidentTarget(null)}
            >
              Отменить
            </Button>
            <Button onClick={() => setResolvedIncidentTarget(null)}>
              Решен
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
