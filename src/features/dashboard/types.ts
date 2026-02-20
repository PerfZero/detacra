import type { LucideIcon } from "lucide-react";

export type IncidentType = "camera" | "reglament" | "audio";
export type DashboardView =
  | "dashboard"
  | "regulations"
  | "notifications"
  | "employees"
  | "settings";

export type NotificationStatusTone = "green" | "amber" | "red" | "gray";
export type NotificationMediaTone = "gray" | "blue" | "none";

export type SidebarItem = {
  label: string;
  icon: LucideIcon;
  badge?: number;
  view?: DashboardView;
};

export type SummaryCard = {
  id: string;
  icon: LucideIcon;
  lead: string;
  badge?: string;
  title: string;
  subtitleLeft: string;
  subtitleRight: string;
};

export type RegulationItem = {
  title: string;
  details: string;
  time: string;
};

export type RegulationTableRow = {
  id: string;
  name: string;
  description: string;
  timeInterval: string;
  photoRequired: boolean;
};

export type StockRow = {
  name: string;
  minStock: number;
  showcaseStock: number;
  warehouseStock: number | null;
};

export type IncidentCard = {
  id: string;
  title: string;
  source: string;
  sourceIcon: LucideIcon;
  location?: string;
  timeAgo: string;
  description: string;
  pictureUrl: string | null;
};

export type OverdueIncidentCard = {
  id: string;
  title: string;
  timeLabel: string;
};

export type NotificationRow = {
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

export type FalseIncidentReasonOption = {
  id: string;
  label: string;
};

export type DashboardPoint = {
  title: string;
  online_status: boolean;
  is_active: boolean;
};
