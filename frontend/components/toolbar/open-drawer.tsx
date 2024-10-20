"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TitleSkeleton from "../skeletons/title-skeleton";
import { Skeleton } from "../ui/skeleton";
import HiddenDropDownAnimated from "../animated/hidden-dropdown-animated";

type Props = {
  children: React.ReactNode;
  title: string;
};

const OpenDrawer = ({ children, title }: Props) => {
  const [open, setOpen] = useState(true);
  return (
    <Card className="p-1 py-3 pb-0">
      <CardHeader className="py-0 px-2 border-b-2 ">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Button
            onClick={() => setOpen(!open)}
            size={"icon"}
            variant={"ghost"}
          >
            <ArrowDown
              size={18}
              className={`transform transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      <HiddenDropDownAnimated open={open}>{children}</HiddenDropDownAnimated>
    </Card>
  );
};

export default OpenDrawer;

export const OpenDrawerHeaderSkeleton = () => {
  return (
    <div className="p-1 py-3  rounded-lg">
      <div className="p-2 border-b-2 ">
        <div className="flex justify-between items-center">
          <TitleSkeleton />
          <Skeleton className="w-6 h-6 rounded-full bg-gray-500" />
        </div>
      </div>
    </div>
  );
};
