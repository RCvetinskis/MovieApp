import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React from "react";

type Props = {
  className?: string;
};

const LoaderSpinner = ({ className }: Props) => {
  return <LoaderCircle className={cn("animate-spin h-12 w-12", className)} />;
};

export default LoaderSpinner;
