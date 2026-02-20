import { Button } from "@/components/ui/button";
import { Facebook, Github, MessageCircle, Twitter } from "lucide-react";

const FOOTER_LINKS = [
  "Privacy policy",
  "О нас",
  "Помощь",
  "Terms & condition",
  "Контакты",
];

export const DashboardFooter = () => {
  return (
    <footer className="border-t bg-background">
      <div className="flex items-center justify-between gap-4 border-b px-6 py-3">
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground">
          {FOOTER_LINKS.map((label) => (
            <button
              key={label}
              type="button"
              className="text-sm transition-colors hover:text-muted-foreground"
            >
              {label}
            </button>
          ))}
        </nav>

        <Button variant="secondary" className="h-9 gap-2 rounded-lg px-4">
          Служба поддержки
          <MessageCircle className="size-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <p className="text-sm text-muted-foreground">
          @2025 Shadcn/studio, Made for better web design
        </p>

        <div className="flex items-center gap-4 text-muted-foreground">
          <button type="button" className="transition-colors hover:text-foreground">
            <Facebook className="size-4" />
          </button>
          <button type="button" className="transition-colors hover:text-foreground">
            <Twitter className="size-4" />
          </button>
          <button type="button" className="transition-colors hover:text-foreground">
            <Github className="size-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
