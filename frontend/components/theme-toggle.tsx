"use client";

import * as React from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ButtonTitleIcon from "./buttons/button-icon-title";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[120px]" align="end">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ButtonTitleIcon title="Light" handleClick={() => setTheme("light")}>
          <Sun />
        </ButtonTitleIcon>
        <ButtonTitleIcon title="Dark" handleClick={() => setTheme("dark")}>
          <Moon />
        </ButtonTitleIcon>

        <ButtonTitleIcon title="System" handleClick={() => setTheme("system")}>
          <SunMoon />
        </ButtonTitleIcon>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
