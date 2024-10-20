import React from "react";
import NavMenuBar from "./nav-menubar";
import { Button } from "../ui/button";
import { Clapperboard } from "lucide-react";
import { movieNavOpts } from "@/lib/constants";

const NavMovie = () => {
  return (
    <NavMenuBar options={movieNavOpts}>
      <Button className="p-0 px-2" variant={"ghost"} size={"sm"}>
        <Clapperboard size={20} />
      </Button>
    </NavMenuBar>
  );
};

export default NavMovie;
