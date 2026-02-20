import { useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { ArrowUpDown, Monitor, Pencil, Plus } from "lucide-react";

type SettingsTab = "langam" | "workplaces" | "audio" | "telegram";

type TelegramNotificationRow = {
  id: string;
  title: string;
  description: string;
  employeeEnabled: boolean;
  managerEnabled: boolean;
};

type TelegramNotificationSection = {
  id: string;
  title: string;
  rows: TelegramNotificationRow[];
};

type WorkplaceLayoutRow = {
  id: number;
  cameraTitle: string;
  workplaces: Array<{ label: string; highlighted?: boolean }>;
};

const WORKPLACE_ROWS: WorkplaceLayoutRow[] = Array.from(
  { length: 38 },
  (_, index) => {
    const id = index + 1;

    if (id === 1) {
      return {
        id,
        cameraTitle: "Камера 1",
        workplaces: [{ label: "#1" }, { label: "#2" }],
      };
    }

    if (id === 2) {
      return {
        id,
        cameraTitle: "Камера 2",
        workplaces: [],
      };
    }

    if (id === 3) {
      return {
        id,
        cameraTitle: "Камера 3",
        workplaces: [
          { label: "#1" },
          { label: "#2", highlighted: true },
          { label: "#3" },
        ],
      };
    }

    return {
      id,
      cameraTitle: `Камера ${id}`,
      workplaces: [],
    };
  },
);

const TELEGRAM_SECTIONS: TelegramNotificationSection[] = [
  {
    id: "video",
    title: "Видеоаналитика",
    rows: [
      {
        id: "video-new",
        title: "Новые инциденты",
        description:
          "Уведомления о новых инцидентах, обнаруженных с помощью видеокамер",
        employeeEnabled: false,
        managerEnabled: true,
      },
      {
        id: "video-overdue",
        title: "Просроченные инциденты",
        description:
          "Уведомления об инцидентах, которые возникли и не были решены в течение 15 минут",
        employeeEnabled: false,
        managerEnabled: false,
      },
    ],
  },
  {
    id: "regulations",
    title: "Регламенты",
    rows: [
      {
        id: "regulations-new-task",
        title: "Новая задача",
        description: "Уведомления согласно настроенному регламенту",
        employeeEnabled: false,
        managerEnabled: true,
      },
      {
        id: "regulations-overdue",
        title: "Просроченные задачи",
        description:
          "Уведомления о задачах, которые не были решены в течение 15 минут после появления",
        employeeEnabled: false,
        managerEnabled: false,
      },
    ],
  },
  {
    id: "showcase",
    title: "Витрина и склад",
    rows: [
      {
        id: "showcase-check",
        title: "Проверка и пополнение Витрины*",
        description: "Уведомления по наполнению Витрины товарами",
        employeeEnabled: false,
        managerEnabled: true,
      },
      {
        id: "showcase-refill",
        title: "Пополнение Склада*",
        description: "Уведомления о необходимости пополнить запасы Склада",
        employeeEnabled: false,
        managerEnabled: false,
      },
    ],
  },
  {
    id: "audio",
    title: "Аудиоаналитика",
    rows: [
      {
        id: "audio-sales",
        title: "Отчеты по скрипту продаж",
        description:
          "Контроль соблюдения скриптов продаж в диалогах с клиентами с автоматическими уведомлениями",
        employeeEnabled: false,
        managerEnabled: true,
      },
    ],
  },
  {
    id: "analytics",
    title: "Аналитика",
    rows: [
      {
        id: "analytics-shift",
        title: "Отчет за смену",
        description:
          "Сводный отчёт о работе клуба за смену: инциденты, выполнение регламентов, действия персонала и ключевые показатели",
        employeeEnabled: false,
        managerEnabled: true,
      },
    ],
  },
];

export const SettingsPageSection = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("workplaces");
  const [workplacePage, setWorkplacePage] = useState(1);
  const [settingsState, setSettingsState] = useState(() => {
    const initialState: Record<
      string,
      { employeeEnabled: boolean; managerEnabled: boolean }
    > = {};

    TELEGRAM_SECTIONS.forEach((section) => {
      section.rows.forEach((row) => {
        initialState[row.id] = {
          employeeEnabled: row.employeeEnabled,
          managerEnabled: row.managerEnabled,
        };
      });
    });

    return initialState;
  });

  const telegramRows = useMemo(
    () =>
      TELEGRAM_SECTIONS.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          employeeEnabled: settingsState[row.id]?.employeeEnabled ?? false,
          managerEnabled: settingsState[row.id]?.managerEnabled ?? false,
        })),
      })),
    [settingsState],
  );

  const updateRowSetting = (
    rowId: string,
    key: "employeeEnabled" | "managerEnabled",
    value: boolean,
  ) => {
    setSettingsState((previous) => ({
      ...previous,
      [rowId]: {
        ...previous[rowId],
        [key]: value,
      },
    }));
  };

  const workplacePageSize = 5;
  const workplaceTotalItems = WORKPLACE_ROWS.length;
  const workplaceTotalPages = Math.max(
    1,
    Math.ceil(workplaceTotalItems / workplacePageSize),
  );
  const workplaceStartIndex = (workplacePage - 1) * workplacePageSize;
  const workplaceRowsPage = WORKPLACE_ROWS.slice(
    workplaceStartIndex,
    workplaceStartIndex + workplacePageSize,
  );
  const workplacePageNumbers = [1, 2, 3, 4];

  return (
    <section>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingsTab)}
      >
        <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-none">
          <div className="border-b px-6 py-6">
            <h2 className="text-xl font-semibold tracking-tight">Настройки</h2>

            <TabsList className="mt-5">
              <TabsTrigger value="langam" className="h-8 px-4">
                Langame
              </TabsTrigger>
              <TabsTrigger value="workplaces" className="h-8 px-4">
                Разметка рабочих мест
              </TabsTrigger>
              <TabsTrigger value="audio" className="h-8 px-4">
                Аудиоаналитика
              </TabsTrigger>
              <TabsTrigger value="telegram" className="h-8 px-4">
                Уведомления в Telegram
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="langam" className="mt-0 p-6">
            <div className=" space-y-5">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Интеграция с Langame</h3>
                <p className="text-sm text-muted-foreground">
                  Для интеграции с Langame введите токен, чтобы получить
                  необходимую информацию.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">API токен</p>
                <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center">
                  <Input placeholder="Введите токен" className="w-full" />
                  <Button className="h-10 px-6 sm:shrink-0">Подключить</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workplaces" className="mt-0">
            <div className="border-b px-6 py-5">
              <h3 className="text-lg font-semibold">Разметка рабочих мест</h3>
            </div>

            <div className="border-b">
              <Table className="min-w-[1120px]">
                <TableHeader>
                  <TableRow className="text-sm text-muted-foreground hover:bg-transparent">
                    <TableHead className="w-[170px] px-6 py-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-left"
                      >
                        Камера
                        <ArrowUpDown className="size-4" />
                      </button>
                    </TableHead>
                    <TableHead className="w-[170px] px-3 py-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-left"
                      >
                        Скриншот
                        <ArrowUpDown className="size-4" />
                      </button>
                    </TableHead>
                    <TableHead className="px-3 py-4">Рабочие места</TableHead>
                    <TableHead className="w-[140px] px-3 py-4 text-right">
                      <span className="inline-flex items-center gap-2">
                        <ArrowUpDown className="size-4" />
                        Действия
                        <ArrowUpDown className="size-4" />
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {workplaceRowsPage.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="px-6 py-3 text-base text-muted-foreground">
                        {row.cameraTitle}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div
                          aria-label={row.cameraTitle}
                          className="h-10 w-[72px] rounded-lg bg-black"
                        />
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {row.workplaces.map((workplace) => (
                            <span
                              key={`${row.id}-${workplace.label}`}
                              className={cn(
                                "inline-flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-semibold",
                                workplace.highlighted
                                  ? "bg-emerald-500 text-white"
                                  : "bg-muted text-foreground",
                              )}
                            >
                              <Monitor className="size-4" />
                              {workplace.label}
                            </span>
                          ))}

                          <button
                            type="button"
                            className="inline-flex h-9 items-center gap-2 px-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <Plus className="size-4" />
                            Добавить
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="px-3 py-3 text-right">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
                          aria-label={`Редактировать ${row.cameraTitle}`}
                        >
                          <Pencil className="size-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Показывать {workplaceRowsPage.length} из {workplaceTotalItems}
              </p>

              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className={cn(
                        workplacePage === 1 && "pointer-events-none opacity-50",
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        setWorkplacePage((previous) =>
                          Math.max(1, previous - 1),
                        );
                      }}
                    />
                  </PaginationItem>

                  {workplacePageNumbers.map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === workplacePage}
                        onClick={(event) => {
                          event.preventDefault();
                          setWorkplacePage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className={cn(
                        workplacePage === workplaceTotalPages &&
                          "pointer-events-none opacity-50",
                      )}
                      onClick={(event) => {
                        event.preventDefault();
                        setWorkplacePage((previous) =>
                          Math.min(workplaceTotalPages, previous + 1),
                        );
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>

          <TabsContent
            value="audio"
            className="mt-0 p-6 text-sm text-muted-foreground"
          >
            Настройки аудиоаналитики будут добавлены в следующем обновлении.
          </TabsContent>

          <TabsContent value="telegram" className="mt-0 p-6">
            <div className="overflow-x-auto rounded-xl border">
              <div className="min-w-[980px] px-5 py-5">
                <div className="grid grid-cols-[1fr_120px_120px] items-center gap-4">
                  <h3 className="text-lg font-semibold">
                    Уведомления в Telegram
                  </h3>
                  <p className="text-right text-sm font-medium text-muted-foreground">
                    Сотрудник
                  </p>
                  <p className="text-right text-sm font-medium text-muted-foreground">
                    Руководитель
                  </p>
                </div>

                <div className="mt-2">
                  {telegramRows.map((section, sectionIndex) => (
                    <div
                      key={section.id}
                      className={sectionIndex > 0 ? "border-t pt-7" : "pt-7"}
                    >
                      <h4 className="text-base font-semibold">
                        {section.title}
                      </h4>

                      <div className="mt-6 space-y-5 pb-7">
                        {section.rows.map((row) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-[1fr_120px_120px] items-center gap-4"
                          >
                            <div>
                              <p className="text-sm font-semibold">
                                {row.title}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {row.description}
                              </p>
                            </div>

                            <div className="flex justify-end">
                              <Switch
                                checked={row.employeeEnabled}
                                onCheckedChange={(checked) =>
                                  updateRowSetting(
                                    row.id,
                                    "employeeEnabled",
                                    checked,
                                  )
                                }
                                aria-label={`Сотрудник: ${row.title}`}
                              />
                            </div>

                            <div className="flex justify-end">
                              <Switch
                                checked={row.managerEnabled}
                                onCheckedChange={(checked) =>
                                  updateRowSetting(
                                    row.id,
                                    "managerEnabled",
                                    checked,
                                  )
                                }
                                aria-label={`Руководитель: ${row.title}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
};
