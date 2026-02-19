import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider.");
  }

  return context;
}

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
};

export function SidebarProvider({
  defaultOpen = true,
  className,
  ...props
}: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar: () => setOpen((prev) => !prev),
    }),
    [open],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        data-slot="sidebar-wrapper"
        data-state={open ? "expanded" : "collapsed"}
        className={cn("group/sidebar-wrapper flex h-full w-full", className)}
        {...props}
      />
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  const { open } = useSidebar();

  return (
    <aside
      data-slot="sidebar"
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "flex h-full shrink-0 flex-col overflow-hidden border-r transition-[width] duration-200 ease-linear",
        open ? "w-[280px]" : "w-[74px]",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-inset"
      className={cn("flex min-w-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex flex-1 flex-col overflow-y-auto", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("mt-auto", className)}
      {...props}
    />
  );
}

export function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 py-1 text-sm font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("space-y-1", className)}
      {...props}
    />
  );
}

export function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("list-none", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  {
    variants: {
      active: {
        true: "bg-muted font-medium",
        false: "font-normal",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

type SidebarMenuButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants>;

export function SidebarMenuButton({
  className,
  active,
  ...props
}: SidebarMenuButtonProps) {
  const { open } = useSidebar();

  return (
    <button
      data-slot="sidebar-menu-button"
      data-collapsed={!open}
      className={cn(
        sidebarMenuButtonVariants({ active }),
        !open && "justify-center px-2",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("cursor-pointer", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="size-4" />
    </Button>
  );
}
