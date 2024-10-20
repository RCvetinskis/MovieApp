import useSWR from "swr";
import Cookies from "js-cookie";
import { getUserById } from "@/actions/backend/user";
const fetchUser = async (userId?: string) => {
  if (!userId) return null;
  return await getUserById(userId);
};

const useUser = () => {
  const userId = Cookies.get("userId");

  const {
    data: user,
    error,
    isValidating,
    mutate,
  } = useSWR(userId ? `/user/${userId}` : null, () => fetchUser(userId), {
    revalidateOnFocus: false,
  });
  return { user, loading: isValidating, error, mutate };
};

export default useUser;
