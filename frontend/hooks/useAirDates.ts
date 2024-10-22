import useSWR from "swr";
import { getEpisodeAirDates } from "@/actions/tmdb api/getRequests";
import { IAirDates } from "@/types";

const fetcher = (tmdbId: string) => getEpisodeAirDates(tmdbId);

const useAirDates = (tmdbId: string) => {
  const { data, error, isLoading } = useSWR<IAirDates | null, Error>(
    tmdbId || null,
    fetcher
  );

  return {
    airDates: data,
    error,
    isLoading,
  };
};

export default useAirDates;
