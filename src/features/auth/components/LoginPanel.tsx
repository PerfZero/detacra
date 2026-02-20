import { useState } from "react";
import type { FormEvent } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginCredentials } from "@/features/auth/authTypes";

type LoginPanelProps = {
  defaultEmail: string;
  defaultPassword: string;
  isLoading: boolean;
  onLogin: (
    credentials: LoginCredentials,
    rememberMe: boolean,
  ) => Promise<void>;
};

export const LoginPanel = ({
  defaultEmail,
  defaultPassword,
  isLoading,
  onLogin,
}: LoginPanelProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onLogin({ email, password }, rememberMe);
  };

  const handleRememberChange = (checked: CheckedState) => {
    setRememberMe(checked === true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl leading-8 font-semibold tracking-normal">
          Вход
        </CardTitle>
        <CardDescription className="text-base leading-6 font-normal tracking-normal">
          Добро пожаловать в Detectra
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Введите свой Email"
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль*</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder=".........."
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-sm">
            <Label
              htmlFor="remember"
              className="font-normal text-muted-foreground"
            >
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={handleRememberChange}
                disabled={isLoading}
              />
              Запомнить меня
            </Label>
            <Button type="button" variant="link" className="h-auto p-0">
              Забыли пароль?
            </Button>
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Входим..." : "Войти"}
          </Button>

          <div className="pt-1 text-center text-sm text-muted-foreground">
            Новый пользователь?
            <Button
              type="button"
              variant="link"
              className="ml-1 h-auto p-0 text-[#CB30E0] hover:text-[#CB30E0]"
            >
              Зарегистрироваться
            </Button>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            или
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="secondary" className="w-full">
            Войти через LANGAME
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
