"use server";
import axios from "axios";
import { API_URL, httpsAgent } from "./utils";
import { getUserTokenId } from "./get-user-token-id";
import { IMediaItemsApiResposne } from "@/types";

export const getMediaitemsByWatchListId = async (
  watchlistId: string,
  page: number = 1,
  limit: number = 20,
  query?: string,
  sortBy?: string
): Promise<IMediaItemsApiResposne> => {
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

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    const requestUrl = `${API_URL}/api/MediaItem/user/${userId}/watchlist/${watchlistId}?${params.toString()}`;

    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });

    return response.data;
  } catch (error: any) {
    console.log(error);
    return error;
  }
};
interface IAddMediaItemResponse {
  message: string;
}
export const addMediaItemToWatchlist = async (
  watchlistId: string,
  mediaItem: {
    type: string;
    tmdbId: string;
    title: string;
  }
): Promise<IAddMediaItemResponse> => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }

    const requestUrl = `${API_URL}/api/MediaItem/user/${userId}/watchlist/${watchlistId}/addMediaItem`;

    const response = await axios.patch(requestUrl, mediaItem, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });

    return response.data;
  } catch (error) {
    let message = "Something went wrong!";

    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
    }

    throw new Error(message);
  }
};
