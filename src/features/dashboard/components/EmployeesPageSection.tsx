import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  KeyRound,
  MoreVertical,
  Pencil,
  PencilLine,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type EmployeeRole = "admin" | "owner" | "manager";
type EmployeeTab = "list" | "schedule";
type WeekdayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type EmployeeRow = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: EmployeeRole;
  phone: string;
  tgConnected: boolean;
  activity: string;
};

const ROLE_META: Record<EmployeeRole, { label: string; icon: LucideIcon }> = {
  admin: { label: "Админ", icon: UserRound },
  owner: { label: "Владелец", icon: PencilLine },
  manager: { label: "Менеджер", icon: KeyRound },
};

const SHIFT_LABELS: Array<{ key: WeekdayKey; label: string }> = [
  { key: "monday", label: "Понедельник" },
  { key: "tuesday", label: "Вторник" },
  { key: "wednesday", label: "Среда" },
  { key: "thursday", label: "Четверг" },
  { key: "friday", label: "Пятница" },
  { key: "saturday", label: "Суббота" },
  { key: "sunday", label: "Воскресенье" },
];

const SHIFT_TEMPLATE: Record<WeekdayKey, string[]>[] = [
  {
    monday: ["12:00 - 13:00", "22:00 - 23:00"],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  {
    monday: ["12:00 - 13:00", "22:00 - 23:00"],
    tuesday: [],
    wednesday: ["12:00 - 13:00", "22:00 - 23:00"],
    thursday: ["12:00 - 13:00", "22:00 - 23:00"],
    friday: [],
    saturday: [],
    sunday: [],
  },
  {
    monday: ["12:00 - 13:00", "22:00 - 23:00"],
    tuesday: [],
    wednesday: ["12:00 - 13:00", "22:00 - 23:00"],
    thursday: ["12:00 - 13:00", "22:00 - 23:00"],
    friday: [],
    saturday: [],
    sunday: [],
  },
  {
    monday: ["12:00 - 13:00", "22:00 - 23:00"],
    tuesday: [],
    wednesday: [],
    thursday: ["12:00 - 13:00", "22:00 - 23:00"],
    friday: [],
    saturday: [],
    sunday: [],
  },
  {
    monday: ["12:00 - 13:00", "22:00 - 23:00"],
    tuesday: [],
    wednesday: [],
    thursday: ["12:00 - 13:00", "22:00 - 23:00"],
    friday: [],
    saturday: [],
    sunday: [],
  },
  {
    monday: ["12:00 - 13:00", "22:00 - 23:00"],
    tuesday: [],
    wednesday: [],
    thursday: ["12:00 - 13:00", "22:00 - 23:00"],
    friday: [],
    saturday: [],
    sunday: [],
  },
];

const baseRows: EmployeeRow[] = [
  {
    id: 1,
    name: "Михаил Иванов",
    email: "mail@gmail.com",
    avatarUrl: null,
    role: "admin",
    phone: "+7 (999) 000-00-00",
    tgConnected: true,
    activity: "19.12.2025, 14:30",
  },
  {
    id: 2,
    name: "Михаил Иванов",
    email: "mail@gmail.com",
    avatarUrl: null,
    role: "owner",
    phone: "+7 (999) 000-00-00",
    tgConnected: false,
    activity: "Не авторизован",
  },
  {
    id: 3,
    name: "Михаил Иванов",
    email: "mail@gmail.com",
    avatarUrl: null,
    role: "admin",
    phone: "+7 (999) 000-00-00",
    tgConnected: true,
    activity: "19.12.2025, 14:30",
  },
  {
    id: 4,
    name: "Михаил Иванов",
    email: "mail@gmail.com",
    avatarUrl: null,
    role: "manager",
    phone: "+7 (999) 000-00-00",
    tgConnected: true,
    activity: "19.12.2025, 14:30",
  },
  {
    id: 5,
    name: "Михаил Иванов",
    email: "mail@gmail.com",
    avatarUrl: null,
    role: "owner",
    phone: "+7 (999) 000-00-00",
    tgConnected: true,
    activity: "19.12.2025, 14:30",
  },
  {
    id: 6,
    name: "Михаил Иванов",
    email: "mail@gmail.com",
    avatarUrl: null,
    role: "manager",
    phone: "+7 (999) 000-00-00",
    tgConnected: true,
    activity: "19.12.2025, 14:30",
  },
];

const employeeRows: EmployeeRow[] = Array.from({ length: 25 }, (_, index) => {
  const template = baseRows[index % baseRows.length];

  return {
    ...template,
    id: index + 1,
  };
});

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

export const EmployeesPageSection = () => {
  const [activeTab, setActiveTab] = useState<EmployeeTab>("list");
  const [employees, setEmployees] = useState<EmployeeRow[]>(employeeRows);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeRow | null>(null);

  const totalItems = employees.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const pageRows = useMemo(
    () => employees.slice(startIndex, endIndex),
    [employees, endIndex, startIndex],
  );
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setEmployees((previous) =>
      previous.filter((employee) => employee.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  };

  return (
    <section>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EmployeeTab)}
      >
        <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-none">
          <div className="border-b px-6 py-6">
            <h2 className="text-xl font-semibold tracking-tight">Сотрудники</h2>

            <TabsList className="mt-5">
              <TabsTrigger value="list" className="h-8 px-4">
                Список всех сотрудников
              </TabsTrigger>
              <TabsTrigger value="schedule" className="h-8 px-4">
                График смен
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="schedule" className="mt-0">
            <div className="flex items-center gap-3 border-b px-6 py-4">
              <span className="text-sm text-muted-foreground">Показать</span>
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-[72px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-b">
              <Table>
                <TableHeader>
                  <TableRow className="text-sm text-muted-foreground">
                    <TableHead className="w-[300px] px-5 py-4">
                      Сотрудник
                    </TableHead>
                    {SHIFT_LABELS.map((day) => (
                      <TableHead key={day.key} className="px-3 py-4">
                        {day.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageRows.map((row) => {
                    const initials = row.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();
                    const rowShifts =
                      SHIFT_TEMPLATE[(row.id - 1) % SHIFT_TEMPLATE.length];

                    return (
                      <TableRow key={`schedule-${row.id}`}>
                        <TableCell className="px-5 py-2.5">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarImage
                                src={row.avatarUrl ?? undefined}
                                alt={row.name}
                              />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {row.name}
                              </p>
                              <p className="truncate text-sm text-muted-foreground">
                                {row.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {SHIFT_LABELS.map((day) => {
                          const slots = rowShifts[day.key];

                          return (
                            <TableCell
                              key={`${row.id}-${day.key}`}
                              className="px-3 py-2.5"
                            >
                              {slots.length ? (
                                <div className="space-y-1 text-xs leading-none">
                                  {slots.map((slot) => (
                                    <p key={slot} className="font-medium">
                                      {slot}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <button
                                  type="button" 
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                  <Plus className="size-4" />
                                  Добавить
                                </button>
                              )}
                            </TableCell>
                          );
                        })}
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
                    <PaginationItem key={`schedule-${page}-${index}`}>
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
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Показать</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-[72px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="gap-2 bg-[#111111] text-white hover:bg-[#111111]/90">
                Добавить товар со склада
                <Plus className="size-4" />
              </Button>
            </div>

            <div className="border-b">
              <Table>
                <TableHeader>
                  <TableRow className="text-sm text-muted-foreground">
                    <TableHead className="px-5 py-4">Сотрудник</TableHead>
                    <TableHead className="px-3 py-4">Роль</TableHead>
                    <TableHead className="px-3 py-4">Телефон</TableHead>
                    <TableHead className="px-3 py-4">TG бот</TableHead>
                    <TableHead className="px-3 py-4">Активность</TableHead>
                    <TableHead className="w-[90px] px-3 py-4 text-right">
                      Действия
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageRows.map((row) => {
                    const roleMeta = ROLE_META[row.role];
                    const RoleIcon = roleMeta.icon;
                    const initials = row.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <TableRow key={row.id}>
                        <TableCell className="px-5 py-2.5">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarImage
                                src={row.avatarUrl ?? undefined}
                                alt={row.name}
                              />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {row.name}
                              </p>
                              <p className="truncate text-sm text-muted-foreground">
                                {row.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-2 text-sm">
                            <RoleIcon className="size-4" />
                            {roleMeta.label}
                          </span>
                        </TableCell>

                        <TableCell className="px-3 py-2.5 text-sm text-muted-foreground">
                          {row.phone}
                        </TableCell>

                        <TableCell className="px-3 py-2.5">
                          {row.tgConnected ? (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                              Подключен
                            </Badge>
                          ) : (
                            <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                              Не подключен
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="px-3 py-2.5 text-sm text-muted-foreground">
                          {row.activity}
                        </TableCell>

                        <TableCell className="px-3 py-2.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="gap-2">
                                <Pencil className="size-4" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                className="gap-2"
                                onSelect={(event) => {
                                  event.preventDefault();
                                  setDeleteTarget(row);
                                }}
                              >
                                <Trash2 className="size-4 text-destructive" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-3.5">
              <p className="text-sm text-muted-foreground">
                Отображено {startIndex + 1}-{endIndex} из {totalItems}{" "}
                сотрудников
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
          </TabsContent>
        </div>
      </Tabs>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-[480px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle>Хотите удалить?</DialogTitle>
            <DialogDescription>
              Удаление необратимо и все данные будут потеряны
            </DialogDescription>
          </DialogHeader>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Сотрудник</p>
            <Input value={deleteTarget?.name ?? ""} readOnly />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Отменить
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
