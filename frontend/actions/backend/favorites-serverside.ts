"use server";
import axios from "axios";
import { API_URL, httpsAgent } from "./utils";
import { cookies } from "next/headers";
import { getUserTokenId } from "./get-user-token-id";

export const getFavoritesListByUserId = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
  type?: string,
  query?: string,
  sortBy?: string
) => {
  const { token } = await getUserTokenId();
  try {
    if (!token) {
      throw new Error("Unauthorized!");
    }
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (query) {
      params.append("query", query);
    }
    if (type) {
      params.append("mediaType", type);
    }
    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    const requestUrl = `${API_URL}/api/Favorites/user/${userId}?${params.toString()}`;

    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    const message = error.response.data
      ? `${error.response.data.message}`
      : "Something went wrong";

    throw new Error(message);
  }
};
