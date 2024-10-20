"use server";
import axios from "axios";
import { API_URL, httpsAgent } from "./utils";

import { ICommentsResponse } from "@/types";

export const getCommentsByPostId = async (
  postId: string,
  page: number = 1,
  limit: number = 20
): Promise<ICommentsResponse | null> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const requestUrl = `${API_URL}/api/Comment/post/${postId}?${params.toString()}`;
    const response = await axios.get(requestUrl, {
      httpsAgent,
    });
    return response.data;
  } catch (error: any) {
    return null;
  }
};
