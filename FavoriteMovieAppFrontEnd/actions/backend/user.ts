"use server";
import axios from "axios";
import { API_URL, httpsAgent } from "./utils";
import { getUserTokenId } from "./get-user-token-id";
import { revalidatePath } from "next/cache";

export const getUserById = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/User/${userId}`, {
      httpsAgent,
    });

    return response.data.user;
  } catch (error: any) {
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token) {
      throw new Error("Unauthorized!");
    }
    const response = await axios.get(`${API_URL}/api/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });

    return response.data.user;
  } catch (error: any) {
    return null;
  }
};

export const patchUser = async (userId: string, body: FormData) => {
  try {
    const { token } = await getUserTokenId();
    if (!token) {
      throw new Error("Unauthorized!");
    }
    const response = await axios.patch(`${API_URL}/api/User/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });

    revalidatePath("/profile/settings");
    return response.data;
  } catch (error: any) {
    console.log(error);
    const message = error.response.data
      ? `${error.response.data.message}`
      : "Something went wrong";

    throw new Error(message);
  }
};
export const patchUserImage = async (userId: string, body: FormData) => {
  try {
    const { token } = await getUserTokenId();
    if (!token) {
      throw new Error("Unauthorized!");
    }

    const response = await axios.patch(
      `${API_URL}/api/User/${userId}/profile-image`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );

    revalidatePath("/profile/settings");
    return response.data;
  } catch (error: any) {
    console.log(error);
    const message = error.response.data
      ? `${error.response.data.message}`
      : "Something went wrong";

    throw new Error(message);
  }
};
