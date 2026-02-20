import { ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { DashboardView, SidebarItem } from "../types";

type DashboardSidebarProps = {
  pageItems: SidebarItem[];
  activeView: DashboardView;
  onSelectView: (view: DashboardView) => void;
};

export const DashboardSidebar = ({
  pageItems,
  activeView,
  onSelectView,
}: DashboardSidebarProps) => {
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
            <SidebarMenuButton
              active={activeView === "dashboard"}
              className="text-[#404040]"
              onClick={() => onSelectView("dashboard")}
            >
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
              const targetView = item.view;

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    active={targetView ? activeView === targetView : false}
                    className="text-[#404040]"
                    onClick={
                      targetView ? () => onSelectView(targetView) : undefined
                    }
                  >
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
