"use client";
import YouTube, { YouTubeProps } from "react-youtube";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import useMediaQuery from "@/hooks/useMediaQuery";
import useOnClickOutside from "@/hooks/useClickOutSide";
import { useRef } from "react";
type Props = {
  videoId: string;
  setOpen: (open: boolean) => void;
};

const YoutubePlayer = ({ videoId, setOpen }: Props) => {
  const isMdSize = useMediaQuery("(max-width: 1054px)");
  const opts: YouTubeProps["opts"] = {
    height: isMdSize ? "300" : "600",
    width: isMdSize ? "375" : "1000",
    playerVars: {
      autoplay: 1,
    },
  };
  const ref = useRef<HTMLDivElement>(null);
  const handleClose = () => {
    setOpen(false);
  };
  useOnClickOutside(ref, handleClose);
  return (
    <div className="fixed inset-0 w-full h-screen bg-black/60 z-49">
      <div className="relative w-full h-full">
        <div
          ref={ref}
          className="w-full max-w-[400px] md:max-w-[1000px] mx-auto  h-full pt-44   relative  "
        >
          <Button
            onClick={() => setOpen(false)}
            className="absolute  top-[15%] -right-1"
            variant={"secondary"}
            size={"icon"}
          >
            <X />
          </Button>
          <YouTube ckas videoId={videoId} opts={opts} />
        </div>
      </div>
    </div>
  );
};

export default YoutubePlayer;
