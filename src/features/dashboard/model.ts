import {
  AudioLines,
  Bell,
  Camera,
  Cctv,
  ChartColumn,
  ChartLine,
  ClipboardCheck,
  ListTodo,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  DashboardPoint,
  FalseIncidentReasonOption,
  IncidentCard,
  IncidentType,
  NotificationMediaTone,
  NotificationRow,
  NotificationStatusTone,
  OverdueIncidentCard,
  RegulationItem,
  RegulationTableRow,
  SidebarItem,
  StockRow,
  SummaryCard,
} from "./types";

type NotificationApiStatus =
  | "new"
  | "cancelled"
  | "failed"
  | "success_after_failed"
  | "success";

type DashboardApiIncident = {
  id: number;
  status: NotificationApiStatus;
  title: string;
  type: string;
  places: string[];
  picture: string | null;
  description: string;
};

type DashboardApiNotification = DashboardApiIncident & {
  device_title: string | null;
  staff: string;
};

export type DashboardApiData = {
  user: {
    first_name: string;
    last_name: string;
    role_title: string;
    avatar: string;
  };
  points: DashboardPoint[];
  video: {
    enabled: boolean;
    cameras_active: number;
    cameras_total: number;
  };
  audio: {
    enabled: boolean;
    devices_active: number;
  };
  reglaments: Array<{
    title: string;
    description: string;
    time: string;
  }>;
  stock: Array<{
    title: string;
    min: number;
    in_stock: number;
  }>;
  active_incidents: DashboardApiIncident[];
  failed_incidents: DashboardApiIncident[];
  notifications: DashboardApiNotification[];
};

export type DashboardApiResponse = {
  result: boolean;
  data?: DashboardApiData;
  errorMessage?: string;
  message?: string;
};

export type DashboardModel = {
  pageItems: SidebarItem[];
  summaryCards: SummaryCard[];
  regulations: RegulationItem[];
  stockRows: StockRow[];
  incidentCards: IncidentCard[];
  overdueIncidentCards: OverdueIncidentCard[];
  notificationRows: NotificationRow[];
  dashboardPoints: DashboardPoint[];
  selectedPointTitle: string;
  isSelectedPointOnline: boolean;
  userFullName: string;
  userRoleTitle: string;
  userAvatar: string;
};

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

const createPageItems = (notificationsBadge?: number): SidebarItem[] => [
  { label: "Регламенты", icon: ClipboardCheck, view: "regulations" },
  { label: "Аналитика", icon: ChartLine },
  { label: "Аудио-аналитика", icon: ChartColumn },
  { label: "Уведомления", icon: Bell, badge: notificationsBadge },
  { label: "Сотрудники", icon: Users },
  { label: "Витрина и склад", icon: ListTodo },
];

export const regulationTableRows: RegulationTableRow[] = [
  {
    id: "#5",
    name: "Оборудование",
    description:
      "STREAM - белая отражающая панель поставлена перед монитором; переставить влево (как в эталоне)",
    timeInterval: "21:00 - 22:00",
    photoRequired: true,
  },
  {
    id: "#4",
    name: "Громкий звук",
    description:
      "ARENA2 - на левом диване у зелёного стола посетитель лежит и громко орет, ноги на диване",
    timeInterval: "20:00 - 21:00",
    photoRequired: false,
  },
  {
    id: "#3",
    name: "Оборудование",
    description:
      "SQUAD1 - место 4 (правое): клавиатура лежит на спинке кресла, вернуть на стол",
    timeInterval: "12:00",
    photoRequired: true,
  },
  {
    id: "#2",
    name: "Беспорядок, мусор",
    description:
      "STREAM - место 1 (свободное): на столе оставлены две обёртки/упаковки (у клавиатуры и на переднем правом краю стола), убрать",
    timeInterval: "15:00",
    photoRequired: false,
  },
  {
    id: "#1",
    name: "Беспорядок, мусор",
    description:
      "SQUAD1 - на столе №4 (правый крайний, свободный): оставлена бутылка/стакан на коврике, убрать",
    timeInterval: "19:00 - 20:00",
    photoRequired: true,
  },
];

export const buildDashboardModel = (
  dashboardData: DashboardApiData,
): DashboardModel => {
  const notificationsBadge = dashboardData.notifications.filter(
    (item) => item.status === "new",
  ).length;

  const activePoint = dashboardData.points.find((point) => point.is_active);
  const selectedPointTitle =
    activePoint?.title ?? dashboardData.points[0]?.title ?? "";

  return {
    pageItems: createPageItems(notificationsBadge),
    summaryCards: [
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
        subtitleRight: dashboardData.audio.enabled
          ? "подключено"
          : "не подключено",
      },
    ],
    regulations: dashboardData.reglaments.map((item) => ({
      title: item.title,
      details: item.description,
      time: item.time,
    })),
    stockRows: dashboardData.stock.map((item) => ({
      name: item.title,
      minStock: item.min,
      showcaseStock: item.in_stock,
      warehouseStock: null,
    })),
    incidentCards: dashboardData.active_incidents.map((item) => {
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
    }),
    overdueIncidentCards: dashboardData.failed_incidents.map((item) => ({
      id: String(item.id),
      title: item.title,
      timeLabel: `#${item.id}`,
    })),
    notificationRows: dashboardData.notifications.map((item) => {
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
    }),
    dashboardPoints: dashboardData.points,
    selectedPointTitle,
    isSelectedPointOnline: activePoint?.online_status ?? false,
    userFullName: `${dashboardData.user.first_name} ${dashboardData.user.last_name}`,
    userRoleTitle: dashboardData.user.role_title,
    userAvatar: dashboardData.user.avatar,
  };
};

export const emptyDashboardModel: DashboardModel = {
  pageItems: createPageItems(),
  summaryCards: [],
  regulations: [],
  stockRows: [],
  incidentCards: [],
  overdueIncidentCards: [],
  notificationRows: [],
  dashboardPoints: [],
  selectedPointTitle: "",
  isSelectedPointOnline: false,
  userFullName: "",
  userRoleTitle: "",
  userAvatar: "",
};

export const statusToneClass: Record<NotificationStatusTone, string> = {
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-[#FEE2E2] text-[#EF4444]",
  gray: "bg-muted text-muted-foreground",
};

export const mediaToneClass: Record<
  Exclude<NotificationMediaTone, "none">,
  string
> = {
  gray: "bg-gradient-to-br from-[#5A5A5A] to-[#121212]",
  blue: "bg-gradient-to-br from-[#6B7BFF] via-[#4E42CA] to-[#2C2C9E]",
};

export const falseIncidentReasonOptions: FalseIncidentReasonOption[] = [
  { id: "reason-1", label: "Текст" },
  { id: "reason-2", label: "Текст" },
  { id: "reason-3", label: "Текст" },
  { id: "reason-other", label: "Другое" },
];
