"use server";
import axios from "axios";
import { API_URL, httpsAgent } from "./utils";
import { cookies } from "next/headers";

export const getFavoritesListByUserId = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
  type?: string
) => {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  try {
    if (!token) {
      throw new Error("Unauthorized!");
    }

    const requestUrl = `${API_URL}/api/Favorites/user/${userId}?page=${page}&limit=${limit}${
      type ? `&mediaType=${type}` : ""
    }`;

    const response = await axios.get(
      requestUrl,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );
    return response.data;
  } catch (error: any) {
    console.log(error);
    const message = error.response.data
      ? `${error.response.data.message}`
      : "Something went wrong";

    throw new Error(message);
  }
};
