import axios from "axios";
import { httpsAgent } from "./utils";
import { IWatchListPostRequest, IWatchListPatchRequest } from "@/types";
import Cookies from "js-cookie";
export const addWatchlist = async (
  userId: string,
  requestBody: IWatchListPostRequest,
  token: string
) => {
  try {
    if (!token) {
      throw new Error("Unauthorized!");
    }

    const response = await axios.post(
      `https://localhost:7163/api/Watchlist/user/${userId}/add`,
      requestBody,
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

    let message;
    if (error.response.data) {
      message = error.response.data.message;
    } else {
      message = "Something went wrong!";
    }

    throw new Error(message);
  }
};
export const editWatchlist = async (
  watchlistId: string,
  requestBody: IWatchListPatchRequest
) => {
  const userId = Cookies.get("userId");
  const token = Cookies.get("auth_token");
  try {
    if (!token) {
      throw new Error("Unauthorized!");
    }

    const response = await axios.patch(
      `https://localhost:7163/api/Watchlist/user/${userId}/edit/${watchlistId}`,
      requestBody,
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

    let message;
    if (error.response.data) {
      message = error.response.data.message;
    } else {
      message = "Something went wrong!";
    }

    throw new Error(message);
  }
};

export const deleteWatchlist = async (
  userId: string,
  watchlistId: string,
  token: string
) => {
  try {
    if (!token) {
      throw new Error("Unauthorized!");
    }

    const response = await axios.delete(
      `https://localhost:7163/api/Watchlist/user/${userId}/delete/${watchlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );

    return response;
  } catch (error: any) {
    console.log(error);

    let message;
    if (error.response.data) {
      message = error.response.data.message;
    } else {
      message = "Something went wrong!";
    }

    throw new Error(message);
  }
};
