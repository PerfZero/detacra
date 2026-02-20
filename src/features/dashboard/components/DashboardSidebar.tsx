import { useState } from "react";
import { ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  const [isStockMenuOpen, setIsStockMenuOpen] = useState(false);
  const activeStockSubmenu =
    activeView === "showcase"
      ? "showcase"
      : activeView === "warehouse"
        ? "warehouse"
        : null;

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
              const isDisabledItem =
                item.label === "Аналитика" || item.label === "Аудио-аналитика";
              const isStockMenuItem = item.label === "Витрина и склад";

              if (isStockMenuItem) {
                const isStockMenuExpanded =
                  isStockMenuOpen || activeStockSubmenu !== null;

                return (
                  <Collapsible
                    key={item.label}
                    open={isStockMenuExpanded}
                    onOpenChange={setIsStockMenuOpen}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          active={activeStockSubmenu !== null}
                          className="text-[#404040]"
                        >
                          <Icon className="size-4 shrink-0" />
                          {open ? (
                            <span className="flex-1 truncate">
                              {item.label}
                            </span>
                          ) : null}
                          {open ? (
                            <ChevronRight
                              className={cn(
                                "size-4 transition-transform",
                                isStockMenuExpanded && "rotate-90",
                              )}
                            />
                          ) : null}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      {open ? (
                        <CollapsibleContent className="mt-1 ml-6 space-y-1">
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm text-[#404040] transition-colors hover:bg-muted/60",
                              activeStockSubmenu === "showcase" &&
                                "bg-muted font-medium",
                            )}
                            onClick={() => onSelectView("showcase")}
                          >
                            Витрина
                          </button>
                          <button
                            type="button"
                            className={cn(
                              "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-sm text-[#404040] transition-colors hover:bg-muted/60",
                              activeStockSubmenu === "warehouse" &&
                                "bg-muted font-medium",
                            )}
                            onClick={() => onSelectView("warehouse")}
                          >
                            Склад
                          </button>
                        </CollapsibleContent>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    active={targetView ? activeView === targetView : false}
                    disabled={isDisabledItem}
                    className={cn(
                      "text-[#404040]",
                      isDisabledItem &&
                        "cursor-not-allowed text-[#404040]/45 hover:bg-transparent",
                    )}
                    onClick={
                      !isDisabledItem && targetView
                        ? () => onSelectView(targetView)
                        : undefined
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
          className={cn(
            "mt-3 w-full justify-center gap-2 text-[#404040]",
            activeView === "settings"
              ? "bg-muted hover:bg-muted"
              : "bg-[#17171710] hover:bg-[#17171710]",
          )}
          onClick={() => onSelectView("settings")}
        >
          <Settings className="size-4" />
          {open ? "Настройки" : null}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};
