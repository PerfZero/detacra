import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  dashboardPoints,
  falseIncidentReasonOptions,
  incidentCards,
  isSelectedPointOnline,
  mediaToneClass,
  notificationRows,
  overdueIncidentCards,
  pageItems,
  regulationTableRows,
  regulations,
  selectedPointTitle,
  statusToneClass,
  stockRows,
  summaryCards,
  userAvatar,
  userFullName,
  userRoleTitle,
} from "@/features/dashboard/model";
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { IncidentsSection } from "@/features/dashboard/components/IncidentsSection";
import { NotificationsSection } from "@/features/dashboard/components/NotificationsSection";
import { OverviewSection } from "@/features/dashboard/components/OverviewSection";
import { RegulationsSection } from "@/features/dashboard/components/RegulationsSection";
import { FalseIncidentDialog } from "@/features/dashboard/components/dialogs/FalseIncidentDialog";
import { ReplenishDialog } from "@/features/dashboard/components/dialogs/ReplenishDialog";
import { ResolvedIncidentDialog } from "@/features/dashboard/components/dialogs/ResolvedIncidentDialog";
import { useDashboardPageState } from "@/features/dashboard/hooks/useDashboardPageState";

type DashboardPageProps = {
  onLogout: () => void;
};

export const DashboardPage = ({ onLogout }: DashboardPageProps) => {
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

  return (
    <div className="h-screen overflow-hidden bg-transparent">
      <SidebarProvider defaultOpen>
        <DashboardSidebar
          pageItems={pageItems}
          activeView={activeView}
          onSelectView={setActiveView}
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
            {activeView === "dashboard" ? (
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
            ) : (
              <RegulationsSection rows={regulationTableRows} />
            )}
          </main>

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
