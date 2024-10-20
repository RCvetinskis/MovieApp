import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  options: { value: string; label: string }[];
};

const NavMenuBar = ({ children, options }: Props) => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer p-0 m-0 " asChild>
          {children}
        </MenubarTrigger>
        <MenubarContent>
          {options.map((opt) => (
            <Link href={opt.value} key={opt.value}>
              <MenubarItem className="cursor-pointer">{opt.label}</MenubarItem>
            </Link>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default NavMenuBar;
