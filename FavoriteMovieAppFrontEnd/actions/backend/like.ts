import axios from "axios";
import { httpsAgent } from "./utils";
import { getUserTokenId } from "./get-user-token-id";

export const postLike = async (commentId: string) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }

    const requestUrl = `https://localhost:7163/api/Likes/post/`;
    const response = await axios.post(
      requestUrl,
      { userId, commentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );
    return response.data.result;
  } catch (error: any) {
    return null;
  }
};

export const getLikeByCommentId = async (commentId: string) => {
  try {
    const requestUrl = `https://localhost:7163/api/Likes/get/comment/${commentId}`;
    const response = await axios.get(requestUrl, {
      httpsAgent,
    });
    return response.data.result;
  } catch (error) {
    return null;
  }
};
