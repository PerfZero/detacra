import { useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { createAuthModule } from "./features/auth/createAuthModule";
import type { LoginCredentials } from "./features/auth/authTypes";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";

const LOGIN_ROUTE = "/login";
const DASHBOARD_ROUTE = "/dashboard";

function App() {
  const { authService, tokenStorage } = useMemo(() => createAuthModule(), []);
  const [token, setToken] = useState<string | null>(() =>
    tokenStorage.getToken(),
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (
    credentials: LoginCredentials,
    rememberMe: boolean,
  ) => {
    const normalizedEmail = credentials.email.trim();

    if (!normalizedEmail || !credentials.password) {
      const message = "Введите email и пароль";
      toast.error(message);
      return;
    }

    setIsLoggingIn(true);

    try {
      const issuedToken = await authService.login({
        email: normalizedEmail,
        password: credentials.password,
      });

      tokenStorage.saveToken(issuedToken, rememberMe);
      setToken(issuedToken);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось авторизоваться";
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    tokenStorage.clearToken();
    setToken(null);
  };

  return (
    <>
      <Routes>
        <Route
          path={LOGIN_ROUTE}
          element={
            token ? (
              <Navigate to={DASHBOARD_ROUTE} replace />
            ) : (
              <LoginPage onLogin={handleLogin} isLoading={isLoggingIn} />
            )
          }
        />
        <Route
          path={DASHBOARD_ROUTE}
          element={
            token ? (
              <DashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to={LOGIN_ROUTE} replace />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={token ? DASHBOARD_ROUTE : LOGIN_ROUTE} replace />
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
