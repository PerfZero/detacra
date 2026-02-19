import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardPageProps = {
  onLogout: () => void;
};

const metrics = [
  { label: "Проверок сегодня", value: "124" },
  { label: "Новых уведомлений", value: "7" },
  { label: "Активных сотрудников", value: "36" },
];

export const DashboardPage = ({ onLogout }: DashboardPageProps) => (
  <div className="min-h-screen bg-background">
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            detectra
          </p>
          <h1 className="text-xl font-semibold md:text-2xl">Дашборд</h1>
        </div>
        <Button variant="outline" type="button" onClick={onLogout}>
          Выйти
        </Button>
      </div>
    </header>

    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Сводка</CardTitle>
          <CardDescription>
            Страница доступна после успешного входа
          </CardDescription>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  </div>
);
