import cron from "node-cron";
import { getMediaById } from "../tmdb api/getRequests";

export const airingTodaySchedule = async () => {
  try {
    cron.schedule("* * * * *", async () => {
      //   const tvShow = await getMediaById("124364", "tv");
      //   console.log(tvShow);
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};
