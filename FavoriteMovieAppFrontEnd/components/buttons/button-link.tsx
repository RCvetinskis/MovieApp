"use client";
import Link from "next/link";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type Props = {
  location: string;
  title: string;
  className?: string;
};

const ButtonLink = ({ location, title, className }: Props) => {
  return (
    <Link className="w-full" href={location}>
      <Button
        type="button"
        className={cn(className, "m-0 p-0  ")}
        variant={"link"}
      >
        {title}
      </Button>
    </Link>
  );
};

export default ButtonLink;
