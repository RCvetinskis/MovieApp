import axios from "axios";
import { httpsAgent } from "./utils";
import { getUserTokenId } from "./get-user-token-id";

export const postComment = async (postId: string, message: string) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }

    const requestUrl = `https://localhost:7163/api/Comment/user/${userId}/post/${postId}/create`;
    const response = await axios.post(
      requestUrl,
      { message },
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

export const replyComment = async (commentId: string, message: string) => {
  try {
    const { token, userId } = await getUserTokenId();
    if (!token || !userId) {
      throw new Error("Unauthorized!");
    }
    const requestUrl = `https://localhost:7163/api/Comment/user/${userId}/comment/${commentId}/reply`;
    const response = await axios.post(
      requestUrl,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        httpsAgent,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};
export const getReplies = async (
  commentId: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const requestUrl = `https://localhost:7163/api/Comment/comment/${commentId}/replies?${params.toString()}`;

    const response = await axios.get(requestUrl, {
      httpsAgent,
    });
    return response.data;
  } catch (error) {
    console.log(error);

    return null;
  }
};
