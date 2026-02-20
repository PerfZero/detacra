import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import dashboardPayload from "@/mocks/dashboard.json";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { applyTheme, resolveInitialTheme } from "@/shared/theme/theme";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  AudioLines,
  Bell,
  Camera,
  Cctv,
  ChartColumn,
  ChartLine,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Flag,
  ListTodo,
  Moon,
  Monitor,
  Pencil,
  Sandwich,
  Settings,
  Sun,
  Trash2,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Theme } from "@/shared/theme/theme";

type DashboardPageProps = {
  onLogout: () => void;
};

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  badge?: number;
};

type SummaryCard = {
  id: string;
  icon: LucideIcon;
  lead: string;
  badge?: string;
  title: string;
  subtitleLeft: string;
  subtitleRight: string;
};

type IncidentType = "camera" | "reglament" | "audio";
type NotificationApiStatus =
  | "new"
  | "cancelled"
  | "failed"
  | "success_after_failed"
  | "success";

type StockRow = {
  name: string;
  minStock: number;
  showcaseStock: number;
  warehouseStock: number | null;
};

type IncidentCard = {
  id: string;
  title: string;
  source: string;
  sourceIcon: LucideIcon;
  location?: string;
  timeAgo: string;
  description: string;
  pictureUrl: string | null;
};

type OverdueIncidentCard = {
  id: string;
  title: string;
  timeLabel: string;
};

type NotificationStatusTone = "green" | "amber" | "red" | "gray";
type NotificationMediaTone = "gray" | "blue" | "none";

type NotificationRow = {
  id: string;
  status: string;
  statusTone: NotificationStatusTone;
  workplace: string;
  incidentName: string;
  description: string;
  dateTime: string;
  assignee: string;
  typeLabel: string;
  typeIcon: LucideIcon;
  camera: string;
  mediaTone: NotificationMediaTone;
};

const dashboardData = dashboardPayload.data;

const resolveIncidentType = (type: string): IncidentType => {
  if (type === "camera" || type === "reglament" || type === "audio") {
    return type;
  }

  return "reglament";
};

const getIncidentTypeIcon = (type: IncidentType): LucideIcon => {
  if (type === "camera") {
    return Cctv;
  }

  if (type === "audio") {
    return AudioLines;
  }

  return ClipboardCheck;
};

const getIncidentTypeLabel = (type: IncidentType) => {
  if (type === "camera") {
    return "Камера";
  }

  if (type === "audio") {
    return "Аудио";
  }

  return "Регламент";
};

const resolveNotificationStatus = (
  status: string,
): { label: string; tone: NotificationStatusTone } => {
  const resolvedStatus = status as NotificationApiStatus;

  if (resolvedStatus === "new") {
    return { label: "Новое", tone: "green" };
  }

  if (resolvedStatus === "cancelled") {
    return { label: "Ложное", tone: "amber" };
  }

  if (resolvedStatus === "failed") {
    return { label: "Просрочено", tone: "red" };
  }

  if (
    resolvedStatus === "success_after_failed" ||
    resolvedStatus === "success"
  ) {
    return { label: "Решено", tone: "gray" };
  }

  return { label: "Новое", tone: "green" };
};

const notificationsBadge = dashboardData.notifications.filter(
  (item) => item.status === "new",
).length;

const pageItems: SidebarItem[] = [
  { label: "Регламенты", icon: ClipboardCheck },
  { label: "Аналитика", icon: ChartLine },
  { label: "Аудио-аналитика", icon: ChartColumn },
  { label: "Уведомления", icon: Bell, badge: notificationsBadge },
  { label: "Сотрудники", icon: Users },
  { label: "Витрина и склад", icon: ListTodo },
];

const summaryCards: SummaryCard[] = [
  {
    id: "cameras",
    icon: Camera,
    lead: String(dashboardData.video.cameras_active),
    badge: dashboardData.video.enabled ? "Подключено" : undefined,
    title: "Камеры",
    subtitleLeft: `${dashboardData.video.cameras_active}/${dashboardData.video.cameras_total}`,
    subtitleRight: "включены в помещении",
  },
  {
    id: "audio",
    icon: AudioLines,
    lead: dashboardData.audio.enabled ? "on" : "off",
    title: "Аудио аналитика",
    subtitleLeft: String(dashboardData.audio.devices_active),
    subtitleRight: dashboardData.audio.enabled ? "подключено" : "не подключено",
  },
];

const regulations = dashboardData.reglaments.map((item) => ({
  title: item.title,
  details: item.description,
  time: item.time,
}));

const stockRows: StockRow[] = dashboardData.stock.map((item) => ({
  name: item.title,
  minStock: item.min,
  showcaseStock: item.in_stock,
  warehouseStock: null,
}));

const incidentCards: IncidentCard[] = dashboardData.active_incidents.map(
  (item) => {
    const incidentType = resolveIncidentType(item.type);

    return {
      id: String(item.id),
      title: item.title,
      source: getIncidentTypeLabel(incidentType),
      sourceIcon: getIncidentTypeIcon(incidentType),
      location: item.places.length ? item.places.join(", ") : undefined,
      timeAgo: `#${item.id}`,
      description: item.description,
      pictureUrl: item.picture,
    };
  },
);

const overdueIncidentCards: OverdueIncidentCard[] =
  dashboardData.failed_incidents.map((item) => ({
    id: String(item.id),
    title: item.title,
    timeLabel: `#${item.id}`,
  }));

const notificationRows: NotificationRow[] = dashboardData.notifications.map(
  (item) => {
    const incidentType = resolveIncidentType(item.type);
    const notificationStatus = resolveNotificationStatus(item.status);

    return {
      id: `#${item.id}`,
      status: notificationStatus.label,
      statusTone: notificationStatus.tone,
      workplace: item.places[0] ?? "—",
      incidentName: item.title,
      description: item.description,
      dateTime: "— / —",
      assignee: item.staff,
      typeLabel: getIncidentTypeLabel(incidentType),
      typeIcon: getIncidentTypeIcon(incidentType),
      camera: item.device_title ?? item.places[0] ?? "—",
      mediaTone: item.picture
        ? item.status === "failed" || item.status === "success_after_failed"
          ? "blue"
          : "gray"
        : "none",
    };
  },
);

const activePoint = dashboardData.points.find((point) => point.is_active);
const selectedPointTitle = activePoint?.title ?? dashboardData.points[0]?.title;
const isSelectedPointOnline = activePoint?.online_status ?? false;
const userFullName = `${dashboardData.user.first_name} ${dashboardData.user.last_name}`;

const statusToneClass: Record<NotificationStatusTone, string> = {
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-[#FEE2E2] text-[#EF4444]",
  gray: "bg-muted text-muted-foreground",
};

const mediaToneClass: Record<Exclude<NotificationMediaTone, "none">, string> = {
  gray: "bg-gradient-to-br from-[#5A5A5A] to-[#121212]",
  blue: "bg-gradient-to-br from-[#6B7BFF] via-[#4E42CA] to-[#2C2C9E]",
};

const falseIncidentReasonOptions = [
  { id: "reason-1", label: "Текст" },
  { id: "reason-2", label: "Текст" },
  { id: "reason-3", label: "Текст" },
  { id: "reason-other", label: "Другое" },
];

const DashboardSidebar = () => {
  const { open } = useSidebar();

  return (
    <Sidebar className="bg-[#FAFAFA] dark:bg-card">
      <SidebarHeader className="items-start p-3 pb-4">
        <img
          src="/logo.svg"
          alt="detectra"
          className={cn("h-6 w-auto self-start dark:invert", !open && "h-6")}
        />
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton active className="text-[#404040]">
              <Settings className="size-4 shrink-0" />
              {open ? <span className="truncate">Дашборд</span> : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarGroup className="mt-4">
          {open ? <SidebarGroupLabel>Страницы</SidebarGroupLabel> : null}
          <SidebarMenu>
            {pageItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton className="text-[#404040]">
                    <Icon className="size-4 shrink-0" />
                    {open ? (
                      <span className="flex-1 truncate">{item.label}</span>
                    ) : null}
                    {open && item.badge ? (
                      <span className="rounded-full bg-muted px-1.5 text-xs">
                        {item.badge}
                      </span>
                    ) : null}
                    {open && item.label === "Витрина и склад" ? (
                      <ChevronRight className="size-4" />
                    ) : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {open ? (
          <Card className="bg-transparent">
            <CardHeader className="pb-1">
              <CardTitle className="text-xl leading-none">
                Повысить тариф
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-foreground">
              <p>
                Ваш пробный период заканчивается через 12 дней. Перейдите на
                более высокий тарифный план.
              </p>
              <Progress value={40} />
              <Button className="w-full">Посмотреть все</Button>
            </CardContent>
          </Card>
        ) : null}

        <Button
          variant="secondary"
          className="mt-3 w-full justify-center gap-2 bg-[#17171710] text-[#404040] hover:bg-[#17171710]"
        >
          <Settings className="size-4" />
          {open ? "Настройки" : null}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export const DashboardPage = ({ onLogout }: DashboardPageProps) => {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme());
  const [selectedStockRow, setSelectedStockRow] = useState<StockRow | null>(
    null,
  );
  const [replenishValue, setReplenishValue] = useState(12);
  const [falseIncidentTarget, setFalseIncidentTarget] = useState<string | null>(
    null,
  );
  const [resolvedIncidentTarget, setResolvedIncidentTarget] = useState<
    string | null
  >(null);
  const [falseIncidentReasonId, setFalseIncidentReasonId] = useState(
    falseIncidentReasonOptions[0].id,
  );

  const handleThemeToggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const handleOpenReplenishDialog = (row: StockRow) => {
    setSelectedStockRow(row);
    setReplenishValue(Math.min(20, Math.max(1, row.minStock)));
  };

  const handleCloseReplenishDialog = () => {
    setSelectedStockRow(null);
  };

  const handleReplenishValueChange = (value: number[]) => {
    const nextValue = value[0];

    if (typeof nextValue === "number") {
      setReplenishValue(nextValue);
    }
  };

  const handleOpenFalseIncidentDialog = (title: string) => {
    setFalseIncidentTarget(title);
    setFalseIncidentReasonId(falseIncidentReasonOptions[0].id);
  };

  const handleCloseFalseIncidentDialog = () => {
    setFalseIncidentTarget(null);
  };

  const handleSubmitFalseIncident = () => {
    setFalseIncidentTarget(null);
  };

  const handleOpenResolvedIncidentDialog = (title: string) => {
    setResolvedIncidentTarget(title);
  };

  const handleCloseResolvedIncidentDialog = () => {
    setResolvedIncidentTarget(null);
  };

  return (
    <div className="h-screen overflow-hidden bg-transparent">
      <SidebarProvider defaultOpen>
        <DashboardSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-5">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <span className="h-6 w-px bg-[#DEDEDF]" />
              <span
                className={cn(
                  "inline-flex items-center rounded-xl px-2 py-1 text-xs",
                  isSelectedPointOnline
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-[#F0F0F2] text-black",
                )}
              >
                {isSelectedPointOnline ? "В сети" : "Не в сети"}
              </span>
              <Select defaultValue={selectedPointTitle}>
                <SelectTrigger className="h-9 border-none bg-transparent px-0 text-sm font-medium text-black shadow-none focus-visible:ring-0">
                  <SelectValue placeholder="Клуб" />
                </SelectTrigger>
                <SelectContent>
                  {dashboardData.points.map((point) => (
                    <SelectItem key={point.title} value={point.title}>
                      Клуб {point.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="size-10 rounded-md border-[#D6D6D8] bg-card text-black hover:bg-card [&_svg]:size-4"
                onClick={handleThemeToggle}
                aria-label={
                  theme === "dark"
                    ? "Включить светлую тему"
                    : "Включить темную тему"
                }
                title={theme === "dark" ? "Светлая тема" : "Темная тема"}
              >
                {theme === "dark" ? <Sun /> : <Moon />}
              </Button>

              <div className="relative">
                <Button
                  size="icon"
                  variant="outline"
                  className="size-10 rounded-md border-[#D6D6D8] bg-card text-black hover:bg-card [&_svg]:size-4"
                >
                  <Bell />
                </Button>
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[#DC3D32]" />
              </div>

              <div className="group relative ml-6">
                <button
                  type="button"
                  className="flex items-center gap-3 rounded-md px-2 py-1 text-left hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  aria-label="Профиль пользователя"
                >
                  <Avatar className="rounded-md border bg-[#EAEAEC]">
                    <AvatarImage
                      src={dashboardData.user.avatar}
                      alt={userFullName}
                    />
                    <AvatarFallback className="rounded-md bg-[#EAEAEC] text-black">
                      <UserRound />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-black">{userFullName}</p>
                    <p className="text-[#787878]">
                      {dashboardData.user.role_title}
                    </p>
                  </div>
                </button>

                <div className="pointer-events-none absolute top-full right-0 z-50 pt-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                  <div className="w-36 rounded-md border bg-popover p-1 shadow-md">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={onLogout}
                    >
                      Выйти
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-4 overflow-y-auto p-8">
            <section className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
              <div className="grid gap-4">
                {summaryCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Card key={item.id} className="rounded-2xl">
                      <CardContent className="space-y-0 pt-0">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center rounded-lg bg-muted">
                            <Icon className="size-10 inline-flex rounded-lg bg-[#17171720] p-2" />
                          </span>
                          <span className="text-2xl leading-none tracking-tight">
                            {item.lead}
                          </span>
                          {item.badge ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-medium text-emerald-700">
                              <span
                                aria-hidden
                                className="size-2 rounded-full bg-[#22C55E]"
                              />
                              {item.badge}
                            </span>
                          ) : null}
                        </div>

                        <div className="space-y-2 pt-4">
                          <p className="text-lg font-semibold leading-none">
                            {item.title}
                          </p>
                          <p className="text-sm gap-2 flex text-muted-foreground">
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
                <CardHeader className="flex-row flex  items-center justify-between space-y-0 ">
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
                        <p className="text-lg font-medium leading-tight">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
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
                <CardHeader className="flex-row flex items-center justify-between space-y-0 ">
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
                        <p className="truncate text-sm font-medium leading-tight">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
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
                        onClick={() => handleOpenReplenishDialog(item)}
                      >
                        Пополнить
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

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
                            <div className="flex items-center justify-between gap-3 mb-2 p-6 py-0">
                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                Новое
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {item.timeAgo}
                              </span>
                            </div>

                            <p className="text-lg font-semibold leading-none p-6 py-1">
                              {item.title}
                            </p>

                            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground p-6 pt-2 pb-4">
                              <span className="inline-flex items-center gap-2">
                                <SourceIcon className="size-4 " />
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

                            <p className="text-base text-muted-foreground p-6 ">
                              {item.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 p-6 py-0">
                              <Button
                                className="w-full"
                                onClick={() =>
                                  handleOpenResolvedIncidentDialog(item.title)
                                }
                              >
                                Завершить
                              </Button>
                              <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() =>
                                  handleOpenFalseIncidentDialog(item.title)
                                }
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

                          <p className="text-lg font-semibold leading-none">
                            {item.title}
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              className="w-full"
                              onClick={() =>
                                handleOpenResolvedIncidentDialog(item.title)
                              }
                            >
                              Завершить
                            </Button>
                            <Button
                              variant="secondary"
                              className="w-full"
                              onClick={() =>
                                handleOpenFalseIncidentDialog(item.title)
                              }
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

            <section>
              <Card className="rounded-2xl shadow-none">
                <CardHeader className="block">
                  <CardTitle className="text-xl  font-semibold leading-none tracking-tight">
                    Уведомления
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 px-0 pb-4">
                  <div className="overflow-x-auto border-y">
                    <table className="w-full min-w-[1500px]">
                      <thead>
                        <tr className="border-b text-left text-sm text-muted-foreground">
                          <th className="px-5 py-4 font-medium">Номер</th>
                          <th className="px-3 py-4 font-medium">
                            <span className="inline-flex items-center gap-2">
                              Статус
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="min-w-[150px] px-3 py-4 font-medium whitespace-nowrap">
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                              Рабочее место
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="min-w-[230px] px-3 py-4 font-medium whitespace-nowrap">
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                              Наименование инцидента
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="min-w-[260px] px-3 py-4 font-medium">
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                              Описание инцидента
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="min-w-[170px] px-3 py-4 font-medium whitespace-nowrap">
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                              Дата / время
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="px-3 py-4 font-medium">
                            <span className="inline-flex items-center gap-2">
                              Ответственный
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="px-3 py-4 font-medium">
                            <span className="inline-flex items-center gap-2">
                              Тип
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="px-3 py-4 font-medium">
                            <span className="inline-flex items-center gap-2">
                              Камера
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="px-3 py-4 font-medium">
                            <span className="inline-flex items-center gap-2">
                              Медиа
                              <ArrowUpDown className="size-4" />
                            </span>
                          </th>
                          <th className="px-3 py-4 font-medium">Действие</th>
                        </tr>
                      </thead>

                      <tbody>
                        {notificationRows.map((row) => {
                          const TypeIcon = row.typeIcon;
                          const [datePart, timePart] = row.dateTime
                            .split("/")
                            .map((part) => part.trim());

                          return (
                            <tr key={row.id} className="border-b text-sm">
                              <td className="px-5 py-3 text-sm text-muted-foreground">
                                {row.id}
                              </td>
                              <td className="px-3 py-3">
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
                              </td>
                              <td className="min-w-[150px] px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
                                {row.workplace}
                              </td>
                              <td className="min-w-[230px] px-3 py-3 text-sm font-semibold whitespace-nowrap">
                                {row.incidentName}
                              </td>
                              <td className="max-w-[280px] px-3 py-3 text-sm text-muted-foreground">
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
                              </td>
                              <td className="min-w-[170px] px-3 py-3 text-sm whitespace-nowrap">
                                <span className="text-foreground">
                                  {datePart ?? row.dateTime}
                                </span>
                                {timePart ? (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    / {timePart}
                                  </span>
                                ) : null}
                              </td>
                              <td className="px-3 py-3 text-sm font-semibold">
                                {row.assignee}
                              </td>
                              <td className="px-3 py-3">
                                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="inline-flex rounded-full bg-muted p-2">
                                    <TypeIcon className="size-4" />
                                  </span>
                                  {row.typeLabel}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-sm text-muted-foreground">
                                {row.camera}
                              </td>
                              <td className="px-3 py-3">
                                {row.mediaTone === "none" ? (
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                ) : (
                                  <span
                                    aria-hidden
                                    className={cn(
                                      "block h-8 w-14 rounded-md",
                                      mediaToneClass[row.mediaTone],
                                    )}
                                  />
                                )}
                              </td>
                              <td className="px-3 py-3">
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="icon">
                                    <Pencil className="size-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash2 className="size-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between px-5">
                    <p className="text-sm text-muted-foreground">
                      Показывать 5 из 205
                    </p>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <ChevronLeft className="size-4" />
                        Предыдущая
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        1
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9"
                      >
                        2
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        3
                      </Button>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        4
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        Следующая
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Dialog
              open={Boolean(falseIncidentTarget)}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handleCloseFalseIncidentDialog();
                }
              }}
            >
              <DialogContent
                showCloseButton={false}
                className="max-w-[440px] rounded-2xl border-none p-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold leading-none">
                    Инцидент ложный?
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Укажите причину, по которой инцидент считается ложным.
                  </DialogDescription>
                </DialogHeader>

                <RadioGroup
                  value={falseIncidentReasonId}
                  onValueChange={setFalseIncidentReasonId}
                  className="space-y-1"
                >
                  {falseIncidentReasonOptions.map((reason) => (
                    <Label
                      key={reason.id}
                      htmlFor={reason.id}
                      className={cn(
                        "w-full cursor-pointer rounded-md border px-3 py-2 text-sm font-normal transition-colors",
                        falseIncidentReasonId === reason.id
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
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleCloseFalseIncidentDialog}
                  >
                    Отменить
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleSubmitFalseIncident}
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
                  handleCloseResolvedIncidentDialog();
                }
              }}
            >
              <DialogContent
                showCloseButton={false}
                className="max-w-[520px] rounded-2xl border-none p-6"
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold leading-none">
                    Инцидент решен?
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    Нажимая «Решён», вы подтверждаете, что инцидент устранён и
                    дальнейших действий не требуется.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleCloseResolvedIncidentDialog}
                  >
                    Отменить
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleCloseResolvedIncidentDialog}
                  >
                    Решен
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={Boolean(selectedStockRow)}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  handleCloseReplenishDialog();
                }
              }}
            >
              <DialogContent className="w-[374px] max-w-[calc(100%-2rem)] rounded-2xl border-none p-6">
                <DialogHeader className="pr-10">
                  <DialogTitle className="text-2xl font-semibold leading-none">
                    Пополнить
                  </DialogTitle>
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
                  onValueChange={handleReplenishValueChange}
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
                    <span className="text-[#787878]">
                      {selectedStockRow?.minStock ?? 0}
                    </span>
                  </div>
                </div>

                <Button
                  className="mt-3 h-12 w-full rounded-xl text-lg"
                  onClick={handleCloseReplenishDialog}
                >
                  Пополнить
                </Button>
              </DialogContent>
            </Dialog>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
