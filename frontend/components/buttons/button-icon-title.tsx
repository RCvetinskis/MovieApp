"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type Props = {
  children: React.ReactNode;
  title: string;
  handleClick: () => void;
  className?: string;
};

const ButtonTitleIcon = ({
  children,
  title,
  className,
  handleClick,
}: Props) => {
  return (
    <Button
      onClick={handleClick}
      className={cn(className, "w-full gap-5 justify-start items-center")}
      variant={"ghost"}
    >
      {children} <span>{title}</span>
    </Button>
  );
};

export default ButtonTitleIcon;
