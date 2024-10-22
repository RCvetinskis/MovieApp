import axios from "axios";
import { API_URL, httpsAgent } from "./utils";
import { getUserTokenId } from "./get-user-token-id";

export const getUserNotifications = async (
  page: number = 1,
  limit: number = 10,
  seen?: "false" | "true"
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

    if (seen) {
      params.append("seen", seen);
    }
    const requestUrl = `${API_URL}/api/Notification/user/${userId}/all?${params.toString()}`;
    const response = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const markNotificationsAsSeen = async (notificationIds: string[]) => {
  try {
    const { token, userId } = await getUserTokenId();

    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }
    const requestUrl = `${API_URL}/api/Notification/mark-as-seen`;
    const response = await axios.patch(requestUrl, notificationIds, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      httpsAgent,
    });

    return response.data;
  } catch (error) {
    return null;
  }
};
