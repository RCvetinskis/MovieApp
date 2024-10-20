import Cookies from "js-cookie";
const useGetUserCookie = () => {
  const userId = Cookies.get("userId");
  const token = Cookies.get("auth_token");
  return { userId, token };
};

export default useGetUserCookie;
