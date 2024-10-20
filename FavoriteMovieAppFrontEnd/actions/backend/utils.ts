import https from "https";

export const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const API_URL = process.env.BACKEND_API_URL;
