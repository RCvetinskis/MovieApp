import { Home } from "lucide-react";
import { Button } from "../ui/button";

const NavHome = () => {
  return (
    <Button className="p-0 px-2" variant={"outline"} size={"sm"}>
      <Home size={20} />
    </Button>
  );
};

export default NavHome;
