import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AudioLines,
  Bell,
  Camera,
  ChartColumn,
  ChartLine,
  ChevronRight,
  ClipboardCheck,
  ListTodo,
  Moon,
  Sandwich,
  Settings,
  Sun,
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

const pageItems: SidebarItem[] = [
  { label: "Регламенты", icon: ClipboardCheck },
  { label: "Аналитика", icon: ChartLine },
  { label: "Аудио-аналитика", icon: ChartColumn },
  { label: "Уведомления", icon: Bell, badge: 3 },
  { label: "Сотрудники", icon: Users },
  { label: "Витрина и склад", icon: ListTodo },
];

const summaryCards: SummaryCard[] = [
  {
    id: "cameras",
    icon: Camera,
    lead: "9",
    badge: "Подключено",
    title: "Камеры",
    subtitleLeft: "9/12",
    subtitleRight: "включены в помещении",
  },
  {
    id: "audio",
    icon: AudioLines,
    lead: "on/off",
    title: "Аудио аналитика",
    subtitleLeft: "12",
    subtitleRight: "не подключено",
  },
];

const regulations = [
  {
    title: "Мусор/Беспорядок",
    details: "На полу между местами 1 и 2 лежит белый мусор",
    time: "14:00",
  },
  {
    title: "Оборудование",
    details: "На месте 2 отсутствует клавиатура",
    time: "13:00 - 14:00",
  },
  {
    title: "Мусор/Беспорядок",
    details: "На полу между местами 1 и 2 лежит белый мусор",
    time: "14:00",
  },
  {
    title: "Оборудование",
    details: "На месте 2 отсутствует клавиатура",
    time: "13:00 - 14:00",
  },
];

const stockRows = [
  {
    name: "Напиток Добрый газированный, 500мл",
    minStock: "Минимальный остаток: 12 штук",
    amount: "5 шт.",
  },
  {
    name: "Напиток Добрый газированный, 500мл",
    minStock: "Минимальный остаток: 12 штук",
    amount: "5 шт.",
  },
  {
    name: "Напиток Добрый Cola без сахара",
    minStock: "Минимальный остаток: 12 штук",
    amount: "10 шт.",
  },
  {
    name: "Напиток Добрый Cola без сахара",
    minStock: "Минимальный остаток: 12 штук",
    amount: "10 шт.",
  },
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

  const handleThemeToggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
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
              <span className="inline-flex items-center rounded-xl bg-[#F0F0F2] px-2 py-1 text-xs text-black">
                Не в сети
              </span>
              <Select defaultValue="mnevniki">
                <SelectTrigger className="h-9 border-none bg-transparent px-0 text-sm font-medium text-black shadow-none focus-visible:ring-0">
                  <SelectValue placeholder="Клуб" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mnevniki">Клуб Мневники</SelectItem>
                  <SelectItem value="arbat">Клуб Арбат</SelectItem>
                  <SelectItem value="tverskaya">Клуб Тверская</SelectItem>
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

              <div className="flex ml-6 items-center gap-3">
                <Avatar className="rounded-md border bg-[#EAEAEC]">
                  <AvatarImage src="/avatar.png" alt="Михаил Иванов" />
                  <AvatarFallback className="rounded-md bg-[#EAEAEC] text-black">
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-black">Михаил Иванов</p>
                  <p className="text-[#787878]">Админ</p>
                </div>
              </div>

              <Button variant="ghost" onClick={onLogout} className="sr-only">
                Выйти
              </Button>
            </div>
          </header>

          <main className="flex-1 space-y-4 overflow-y-auto p-8">
            <section className="grid gap-4 xl:grid-cols-[1fr_1fr_1fr]">
              <div className="grid gap-4">
                {summaryCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Card key={item.id} className="rounded-2xl">
                      <CardContent className="space-y-5 p-5">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center rounded-lg bg-muted px-2 py-2">
                            <Icon className="size-4" />
                          </span>
                          <span className="text-4xl leading-none tracking-tight">
                            {item.lead}
                          </span>
                          {item.badge ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-sm font-medium text-emerald-700">
                              {item.badge}
                            </span>
                          ) : null}
                        </div>

                        <div className="space-y-2">
                          <p className="text-2xl font-semibold leading-none">
                            {item.title}
                          </p>
                          <p className="text-base text-muted-foreground">
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
                      className="flex items-start justify-between gap-4"
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
                          {item.minStock}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "pt-0.5 whitespace-nowrap text-lg font-medium",
                          item.amount.startsWith("10")
                            ? "text-[#D2933C]"
                            : "text-[#E15241]",
                        )}
                      >
                        {item.amount}
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-xl"
                      >
                        Пополнить
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
