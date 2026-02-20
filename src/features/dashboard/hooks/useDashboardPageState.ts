import { useEffect, useState } from "react";
import { falseIncidentReasonOptions } from "@/features/dashboard/model";
import type { DashboardView, StockRow } from "@/features/dashboard/types";
import { applyTheme, resolveInitialTheme } from "@/shared/theme/theme";
import type { Theme } from "@/shared/theme/theme";

export const useDashboardPageState = () => {
  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
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

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
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

  return {
    activeView,
    theme,
    selectedStockRow,
    replenishValue,
    falseIncidentTarget,
    resolvedIncidentTarget,
    falseIncidentReasonId,
    setFalseIncidentReasonId,
    setActiveView,
    handleThemeToggle,
    handleOpenReplenishDialog,
    handleCloseReplenishDialog,
    handleReplenishValueChange,
    handleOpenFalseIncidentDialog,
    handleCloseFalseIncidentDialog,
    handleSubmitFalseIncident,
    handleOpenResolvedIncidentDialog,
    handleCloseResolvedIncidentDialog,
  };
};
