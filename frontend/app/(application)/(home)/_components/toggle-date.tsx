"use client";

import BtnSkeleton from "@/components/skeletons/btn-skeleton";
import { Button } from "@/components/ui/button";
import { useSetDate } from "@/store/store";

const ToggleDate = () => {
  const { date, setDay, setWeek } = useSetDate();
  return (
    <div className="relative w-44 flex">
      <Button
        onClick={setDay}
        variant={date === "day" ? "shimmer" : "outline"}
        className={`absolute transition-transform duration-300 -top-4 ${
          date === "day" ? "left-0" : "left-full -translate-x-full"
        }`}
      >
        Today
      </Button>
      <Button
        onClick={setWeek}
        variant={date === "week" ? "shimmer" : "outline"}
        className={`absolute transition-transform duration-300 -top-4  ${
          date === "week" ? "left-0" : "left-full -translate-x-full"
        }`}
      >
        This week
      </Button>
    </div>
  );
};

export default ToggleDate;

export const ToggleDateSkeleton = () => {
  return (
    <div className="w-44 flex">
      <BtnSkeleton />
      <BtnSkeleton />
    </div>
  );
};
