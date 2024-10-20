import axios from "axios";
import { httpsAgent } from "./utils";

export const onLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `https://localhost:7163/api/Auth/login`,
      {
        email,
        password,
      },
      {
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
export const onRegister = async (data: {
  userName: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `https://localhost:7163/api/Auth/register`,
      data,
      {
        httpsAgent,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log(error);
    const message = error.response.data
      ? `${error.response.data.message}, ${error.response.data.errors[0].description}`
      : "Something went wrong";

    throw new Error(message);
  }
};
