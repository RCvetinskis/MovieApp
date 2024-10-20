import axios from "axios";
import { httpsAgent } from "./utils";
import { getUserTokenId } from "./get-user-token-id";

export const getUserFavoriteMediaById = async (
  type: string,
  tmdbId: string
) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }
    const response = await axios.get(
      `https://localhost:7163/api/Favorites/user/${userId}/type/${type}/tmdb/${tmdbId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response.data.message) {
      return null;
    }

    const message = error.response.data
      ? `${error.response.data.message}`
      : "Something went wrong";

    throw new Error(message);
  }
};
export const addToFavorites = async (type: "movie" | "tv", tmdbId: string) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }
    const response = await axios.post(
      `https://localhost:7163/api/Favorites/user/${userId}/add`,
      {
        tmdbId,
        type,
      },
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
export const removeFromFavorites = async (
  type: "movie" | "tv",
  tmdbId: string
) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }
    const response = await axios.delete(
      `https://localhost:7163/api/Favorites/user/${userId}/type/${type}/tmdb/${tmdbId}/delete`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );
    const deleted = response.status === 204 ? true : false;
    return deleted;
  } catch (error: any) {
    console.log(error);
    const message = error.response.data
      ? `${error.response.data.message}`
      : "Something went wrong";

    throw new Error(message);
  }
};
