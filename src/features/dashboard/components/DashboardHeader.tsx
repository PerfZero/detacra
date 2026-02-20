import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { Theme } from "@/shared/theme/theme";
import { Bell, Moon, Sun, UserRound } from "lucide-react";
import type { DashboardPoint } from "../types";

type DashboardHeaderProps = {
  theme: Theme;
  isSelectedPointOnline: boolean;
  points: DashboardPoint[];
  selectedPointTitle: string;
  userFullName: string;
  userRoleTitle: string;
  userAvatar: string;
  onThemeToggle: () => void;
  onLogout: () => void;
};

export const DashboardHeader = ({
  theme,
  isSelectedPointOnline,
  points,
  selectedPointTitle,
  userFullName,
  userRoleTitle,
  userAvatar,
  onThemeToggle,
  onLogout,
}: DashboardHeaderProps) => {
  return (
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
            {points.map((point) => (
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
          onClick={onThemeToggle}
          aria-label={
            theme === "dark" ? "Включить светлую тему" : "Включить темную тему"
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
              <AvatarImage src={userAvatar} alt={userFullName} />
              <AvatarFallback className="rounded-md bg-[#EAEAEC] text-black">
                <UserRound />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-black">{userFullName}</p>
              <p className="text-[#787878]">{userRoleTitle}</p>
            </div>
          </button>

          <div className="pointer-events-none absolute top-full right-0 z-50 pt-2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
            <div className="w-36 rounded-md border bg-popover p-1 shadow-md">
              <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
