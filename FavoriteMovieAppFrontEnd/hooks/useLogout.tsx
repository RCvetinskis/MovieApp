"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("userId");
    Cookies.remove("expires_at");
    router.push("/login");
  };

  return handleLogout;
};

export default useLogout;
