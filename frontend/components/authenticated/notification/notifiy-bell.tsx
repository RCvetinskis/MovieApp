import { cn } from "@/lib/utils";
import { BellRing } from "lucide-react";
import React from "react";

type Props = {
  notificationsCount?: number;
  className?: string;
  color?: string;
};

const NotifiyBell = ({ className, color, notificationsCount }: Props) => {
  return (
    <div className={cn("flex items-center gap-1 ", className)}>
      <BellRing fill={color} stroke={color} size={18} />
      <span className="text-xs font-bold">{notificationsCount}</span>
    </div>
  );
};

export default NotifiyBell;
