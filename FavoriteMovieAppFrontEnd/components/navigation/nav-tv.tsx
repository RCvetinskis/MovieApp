import React from "react";
import NavMenuBar from "./nav-menubar";
import { Button } from "../ui/button";
import { Tv } from "lucide-react";
import { tvNavOpts } from "@/lib/constants";

const NavTv = () => {
  return (
    <NavMenuBar options={tvNavOpts}>
      <Button className="p-0 px-2" variant={"ghost"} size={"sm"}>
        <Tv size={18} />
      </Button>
    </NavMenuBar>
  );
};

export default NavTv;
