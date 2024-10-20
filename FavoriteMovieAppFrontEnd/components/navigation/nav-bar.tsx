"use client";
import useMediaQuery from "@/hooks/useMediaQuery";
import useRoutes from "@/hooks/useRoutes";
import { useState, useEffect } from "react";
import NavItem, { NavItemSkeleton } from "./nav-item";
import Search, { SearchSkeleton } from "../search";
import SearchOpen from "../search/search-open";

const NavBar = () => {
  const [isMounted, setIsMounted] = useState(false);

  const isMdSize = useMediaQuery("(max-width: 1054px)");
  const routes = useRoutes();
  const leftRoutes = routes.slice(0, 3);
  const rightRoutes = routes.slice(3);
  const SearchComponent = isMdSize ? SearchOpen : Search;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <nav className="fixed top-0 w-full py-3 px-2 lg:px-6 lg:h-16 h-fit z-50  shadow-2xl bg-primary-foreground ">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center  lg:space-x-6 space-x-2">
            {[...Array(3)].map((_, i) => (
              <NavItemSkeleton key={i} />
            ))}
          </div>
          <div className="flex-grow flex justify-center">
            <SearchSkeleton />
          </div>

          <div className="flex items-center  lg:space-x-6 space-x-2">
            {[...Array(1)].map((_, i) => (
              <NavItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </nav>
    );
  }
  return (
    <nav className="fixed top-0 w-full py-3 px-2 lg:px-6 lg:h-16 h-fit z-50 shadow-2xl bg-primary-foreground ">
      <div className="flex justify-between items-center w-full ">
        {/* left section */}
        <div className="flex items-center  lg:space-x-6 space-x-2">
          {leftRoutes.map((route) => (
            <NavItem key={route.label} route={route} />
          ))}
        </div>

        {/* middle section */}
        <div className="flex-grow flex justify-center">
          <SearchComponent />
        </div>

        {/* Right Section - Other Routes */}
        <div className="flex items-center  lg:space-x-6 space-x-2">
          {rightRoutes.map((route) => (
            <NavItem key={route.label} route={route} />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
