import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        caption_label: "text-sm font-medium",
        month_caption: cn(
          "flex items-center justify-center pt-1 relative",
          defaultClassNames.month_caption,
        ),
        nav: cn(
          "flex items-center gap-1 absolute right-1 top-1",
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          defaultClassNames.button_next,
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn(
          "relative p-0 text-center [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          defaultClassNames.day,
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
          defaultClassNames.day_button,
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: cn("bg-accent text-accent-foreground", defaultClassNames.today),
        outside: cn(
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled,
        ),
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
