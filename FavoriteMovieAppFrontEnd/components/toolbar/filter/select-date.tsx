"use client";
import {
  DatePickerWithRange,
  DatePickerWithRangeSkeleton,
} from "@/components/date-picker-with-range";
import TitleSkeleton from "@/components/skeletons/title-skeleton";
import React from "react";

const SelectDate = () => {
  return (
    <div>
      <h2 className="my-2 font-semibold">Release Dates</h2>
      <DatePickerWithRange />
    </div>
  );
};

export default SelectDate;

export const SelectDateSkeleton = () => {
  return (
    <div className="p-2">
      <div className="my-2">
        <TitleSkeleton />
      </div>
      <DatePickerWithRangeSkeleton />
    </div>
  );
};
