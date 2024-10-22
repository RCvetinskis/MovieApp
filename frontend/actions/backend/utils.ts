import https from "https";

export const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
