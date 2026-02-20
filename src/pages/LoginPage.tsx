import { LoginPanel } from "@/features/auth/components/LoginPanel";
import type { LoginCredentials } from "@/features/auth/authTypes";
import { env } from "@/config/env";

type LoginPageProps = {
  onLogin: (
    credentials: LoginCredentials,
    rememberMe: boolean,
  ) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
};

export const LoginPage = ({
  onLogin,
  isLoading,
  errorMessage,
}: LoginPageProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8">
      <img
        src="/detectra.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[-22px] left-1/2 w-[min(1700px,115vw)] -translate-x-1/2 select-none opacity-[0.05]"
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[520px] items-center">
        <LoginPanel
          defaultEmail={env.defaultEmail}
          defaultPassword={env.defaultPassword}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onLogin={onLogin}
        />
      </div>
    </div>
  );
};
