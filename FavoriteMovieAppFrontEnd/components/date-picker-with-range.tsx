"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useSearchFilterStore } from "@/store/store-filter-search";
import InputSkeleton from "./skeletons/input-skeleton";

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setReleaseDateFrom, setReleaseDateTo } = useSearchFilterStore();
  const [manualDate, setManualDate] = React.useState({
    from: "",
    to: "",
  });

  // Function to handle manual input change and update state
  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManualDate((prev) => ({ ...prev, [name]: value }));

    // Update the global store when the dates change
    if (name === "from") {
      setReleaseDateFrom(value);
    } else {
      setReleaseDateTo(value);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      {/* Manual Date Input */}
      <div className="flex justify-between items-center">
        <Input
          type="date"
          name="from"
          value={manualDate.from}
          onChange={handleManualDateChange}
          className="w-[150px] cursor-pointer hover:bg-primary-foreground/60"
        />
        <Input
          type="date"
          name="to"
          value={manualDate.to}
          onChange={handleManualDateChange}
          className="w-[150px] cursor-pointer hover:bg-primary-foreground/60"
        />
      </div>

      {/* displayed date */}
      <div
        className={cn(
          "border rounded p-2  flex items-center gap-3",
          !manualDate && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {manualDate?.from ? (
          manualDate.to ? (
            <>
              {format(manualDate.from, "LLL dd, y")} -{" "}
              {format(manualDate.to, "LLL dd, y")}
            </>
          ) : (
            format(manualDate.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date</span>
        )}
      </div>
    </div>
  );
}

export const DatePickerWithRangeSkeleton = () => {
  return (
    <div className="grid gap-2">
      <div className="flex justify-between items-center">
        <InputSkeleton />
        <InputSkeleton />
      </div>
      <div>
        <InputSkeleton />
      </div>
    </div>
  );
};
