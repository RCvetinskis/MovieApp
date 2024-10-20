"use client";

import HoverLabel from "@/components/hover-label";
import { Button } from "@/components/ui/button";
import YoutubePlayer from "@/components/youtube-player";
import { TvMinimalPlay } from "lucide-react";
import { useState } from "react";

type Props = {
  videoId: string;
};

const ActionPlayTrailer = ({ videoId }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <HoverLabel asChild label="Watch Trailer" side="bottom">
        <Button
          size={"lg"}
          variant={"secondary"}
          className="rounded-full p-2 aspect-square"
          onClick={() => setOpen(!open)}
        >
          <TvMinimalPlay size={22} />
        </Button>
      </HoverLabel>
      {open && <YoutubePlayer videoId={videoId} setOpen={setOpen} />}
    </div>
  );
};

export default ActionPlayTrailer;
