"use server";
import axios from "axios";
import { API_URL, httpsAgent } from "./utils";
import { getUserTokenId } from "./get-user-token-id";

export const getWatchListById = async (watchlistId: string) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }

    const requestUrl = `${API_URL}/api/Watchlist/user/${userId}/get/${watchlistId}`;

    const response = await axios.get(
      requestUrl,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );
    return response.data.watchlist;
  } catch (error: any) {
    console.log(error);

    return null;
  }
};

export const getWatchListsByUserId = async (
  page: number = 1,
  limit: number = 20,
  query?: string
) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (query) {
      params.append("query", query);
    }

    const requestUrl = `${API_URL}/api/Watchlist/user/${userId}/get/all?${params.toString()}`;

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

    return null;
  }
};
