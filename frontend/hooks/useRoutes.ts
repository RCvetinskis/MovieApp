"use client";

import NavHome from "@/components/navigation/nav-home";
import NavMovie from "@/components/navigation/nav-movie";
import NavTv from "@/components/navigation/nav-tv";
import NavUser from "@/components/authenticated/navigation/nav-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { Route } from "@/types";
import { usePathname } from "next/navigation";

import NavLogin from "@/components/navigation/nav-login";
import { useUserStore } from "@/store/store-user";
import NavNotification from "@/components/authenticated/navigation/nav-notification";

const useRoutes = () => {
  const pathname = usePathname();

  const { user } = useUserStore();

  const authRoutes: Route[] = [
    {
      href: undefined,
      label: "Notifications",
      active: undefined,
      Component: NavNotification,
    },
    {
      href: undefined,
      label: user ? user.userName : "Profile",
      active: pathname.includes("profile"),
      Component: NavUser,
    },
  ];

  const routes: Route[] = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
      Component: NavHome,
    },
    {
      href: undefined,
      label: "Movie",
      active: pathname.includes("movie"),
      Component: NavMovie,
    },
    {
      href: undefined,
      label: "Tv",
      active: pathname.includes("tv"),
      Component: NavTv,
    },
    {
      href: undefined,
      label: "Theme",
      active: undefined,
      Component: ThemeToggle,
    },
  ];
  if (!user) {
    routes.push({
      href: "/login",
      label: "Login",
      active: pathname.includes("login") || pathname.includes("register"),
      Component: NavLogin,
    });
  } else {
    routes.push(...authRoutes);
  }

  return routes;
};

export default useRoutes;
