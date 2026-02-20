import { useEffect, useState } from "react";
import type { DashboardView } from "@/features/dashboard/types";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  buildDashboardModel,
  type DashboardApiResponse,
  emptyDashboardModel,
  falseIncidentReasonOptions,
  mediaToneClass,
  regulationTableRows,
  statusToneClass,
} from "@/features/dashboard/model";
import { useSearchParams } from "react-router-dom";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardFooter } from "@/features/dashboard/components/DashboardFooter";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { EmployeesPageSection } from "@/features/dashboard/components/EmployeesPageSection";
import { IncidentsSection } from "@/features/dashboard/components/IncidentsSection";
import { NotificationsSection } from "@/features/dashboard/components/NotificationsSection";
import { NotificationsPageSection } from "@/features/dashboard/components/NotificationsPageSection";
import { OverviewSection } from "@/features/dashboard/components/OverviewSection";
import { RegulationsSection } from "@/features/dashboard/components/RegulationsSection";
import { ShowcasePageSection } from "@/features/dashboard/components/ShowcasePageSection";
import { SettingsPageSection } from "@/features/dashboard/components/SettingsPageSection";
import { WarehousePageSection } from "@/features/dashboard/components/WarehousePageSection";
import { FalseIncidentDialog } from "@/features/dashboard/components/dialogs/FalseIncidentDialog";
import { ReplenishDialog } from "@/features/dashboard/components/dialogs/ReplenishDialog";
import { ResolvedIncidentDialog } from "@/features/dashboard/components/dialogs/ResolvedIncidentDialog";
import { useDashboardPageState } from "@/features/dashboard/hooks/useDashboardPageState";

type DashboardPageProps = {
  onLogout: () => void;
};

const DASHBOARD_INFO_URL =
  "https://swiftcore.network/api/lk/dashboard-info?token=6c8d506e186b83afa4ae021cb7c7bf0b";

const resolveDashboardView = (rawView: string | null): DashboardView => {
  if (rawView === "regulations") {
    return "regulations";
  }

  if (rawView === "notifications") {
    return "notifications";
  }

  if (rawView === "employees") {
    return "employees";
  }

  if (rawView === "settings") {
    return "settings";
  }

  if (rawView === "showcase") {
    return "showcase";
  }

  if (rawView === "warehouse") {
    return "warehouse";
  }

  return "dashboard";
};

export const DashboardPage = ({ onLogout }: DashboardPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryView = resolveDashboardView(searchParams.get("view"));
  const [dashboardModel, setDashboardModel] = useState(emptyDashboardModel);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const {
    activeView,
    theme,
    selectedStockRow,
    replenishValue,
    falseIncidentTarget,
    resolvedIncidentTarget,
    falseIncidentReasonId,
    setActiveView,
    setFalseIncidentReasonId,
    handleThemeToggle,
    handleOpenReplenishDialog,
    handleCloseReplenishDialog,
    handleReplenishValueChange,
    handleOpenFalseIncidentDialog,
    handleCloseFalseIncidentDialog,
    handleSubmitFalseIncident,
    handleOpenResolvedIncidentDialog,
    handleCloseResolvedIncidentDialog,
  } = useDashboardPageState();

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(DASHBOARD_INFO_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Ошибка загрузки дашборда: ${response.status}`);
        }

        const payload = (await response.json()) as DashboardApiResponse;

        if (!payload.result || !payload.data) {
          throw new Error(
            payload.errorMessage ?? payload.message ?? "Сервер вернул ошибку",
          );
        }

        setDashboardModel(buildDashboardModel(payload.data));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить данные дашборда",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (activeView !== queryView) {
      setActiveView(queryView);
    }
  }, [activeView, queryView, setActiveView]);

  const handleSelectView = (view: DashboardView) => {
    setActiveView(view);

    const nextSearchParams = new URLSearchParams(searchParams);
    if (view === "dashboard") {
      nextSearchParams.delete("view");
    } else {
      nextSearchParams.set("view", view);
    }

    setSearchParams(nextSearchParams);
  };

  const {
    pageItems,
    dashboardPoints,
    selectedPointTitle,
    isSelectedPointOnline,
    userFullName,
    userRoleTitle,
    userAvatar,
    summaryCards,
    regulations,
    stockRows,
    incidentCards,
    overdueIncidentCards,
    notificationRows,
  } = dashboardModel;

  return (
    <div className="h-screen overflow-hidden bg-transparent">
      <SidebarProvider defaultOpen>
        <DashboardSidebar
          pageItems={pageItems}
          activeView={activeView}
          onSelectView={handleSelectView}
        />

        <SidebarInset>
          <DashboardHeader
            theme={theme}
            isSelectedPointOnline={isSelectedPointOnline}
            points={dashboardPoints}
            selectedPointTitle={selectedPointTitle}
            userFullName={userFullName}
            userRoleTitle={userRoleTitle}
            userAvatar={userAvatar}
            onThemeToggle={handleThemeToggle}
            onLogout={onLogout}
          />

          <main className="flex-1 space-y-4 overflow-y-auto p-8">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Загружаем данные дашборда...
              </p>
            ) : loadError ? (
              <p className="text-sm text-destructive">{loadError}</p>
            ) : activeView === "dashboard" ? (
              <>
                <OverviewSection
                  summaryCards={summaryCards}
                  regulations={regulations}
                  stockRows={stockRows}
                  onOpenReplenishDialog={handleOpenReplenishDialog}
                />

                <IncidentsSection
                  incidentCards={incidentCards}
                  overdueIncidentCards={overdueIncidentCards}
                  onResolveIncident={handleOpenResolvedIncidentDialog}
                  onFalseIncident={handleOpenFalseIncidentDialog}
                />

                <NotificationsSection
                  notificationRows={notificationRows}
                  statusToneClass={statusToneClass}
                  mediaToneClass={mediaToneClass}
                />
              </>
            ) : activeView === "notifications" ? (
              <NotificationsPageSection
                notificationRows={notificationRows}
                statusToneClass={statusToneClass}
                mediaToneClass={mediaToneClass}
              />
            ) : activeView === "employees" ? (
              <EmployeesPageSection />
            ) : activeView === "settings" ? (
              <SettingsPageSection />
            ) : activeView === "showcase" ? (
              <ShowcasePageSection />
            ) : activeView === "warehouse" ? (
              <WarehousePageSection />
            ) : (
              <RegulationsSection rows={regulationTableRows} />
            )}
          </main>
          <DashboardFooter />

          <FalseIncidentDialog
            open={Boolean(falseIncidentTarget)}
            reasonId={falseIncidentReasonId}
            reasonOptions={falseIncidentReasonOptions}
            onChangeOpen={(isOpen) => {
              if (!isOpen) {
                handleCloseFalseIncidentDialog();
              }
            }}
            onReasonChange={setFalseIncidentReasonId}
            onCancel={handleCloseFalseIncidentDialog}
            onSubmit={handleSubmitFalseIncident}
          />

          <ResolvedIncidentDialog
            open={Boolean(resolvedIncidentTarget)}
            onChangeOpen={(isOpen) => {
              if (!isOpen) {
                handleCloseResolvedIncidentDialog();
              }
            }}
            onCancel={handleCloseResolvedIncidentDialog}
            onConfirm={handleCloseResolvedIncidentDialog}
          />

          <ReplenishDialog
            open={Boolean(selectedStockRow)}
            selectedStockRow={selectedStockRow}
            replenishValue={replenishValue}
            onChangeOpen={(isOpen) => {
              if (!isOpen) {
                handleCloseReplenishDialog();
              }
            }}
            onValueChange={handleReplenishValueChange}
            onClose={handleCloseReplenishDialog}
          />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
