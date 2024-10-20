"use server";

import { cookies } from "next/headers";

export const getUserTokenId = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  const userId = cookieStore.get("userId")?.value;

  return { userId, token };
};
