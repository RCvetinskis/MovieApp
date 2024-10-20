import HoverLabel from "@/components/hover-label";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  type: string;
  tmdbId: string;
};

const Details = ({ type, tmdbId }: Props) => {
  return (
    <HoverLabel asChild label="Details">
      <Link href={`/details/${type}/${tmdbId.toString()}`}>
        <Button variant={"ghost"}>
          <Info />
        </Button>
      </Link>
    </HoverLabel>
  );
};

export default Details;
