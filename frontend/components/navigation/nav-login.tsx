import { Button } from "../ui/button";
import { LogIn } from "lucide-react";

const NavLogin = () => {
  return (
    <Button className="p-0 px-2" variant={"outline"} size={"sm"}>
      <LogIn size={20} />
    </Button>
  );
};

export default NavLogin;
