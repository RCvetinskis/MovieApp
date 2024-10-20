"use server";
import axios from "axios";
import { options } from "./utils/options";
import {
  IMediaType,
  MovieAPICreditsResponse,
  MovieApiVideoResponse,
} from "@/types";

export const getSearchResults = async (
  query: string,
  category: string = "multi",
  page: string = "1"
) => {
  try {
    const searchCategory =
      category === "All" ? "multi" : category.toLowerCase();

    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/search/${searchCategory}?query=${query}&include_adult=false&language=en-US&page=${page}`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getTrending = async (date: string = "day") => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/trending/all/${date}?language=en-US`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMovieLists = async (
  type: string = "popular",
  page: string = "1"
) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/movie/${type}?language=en-US&page=${page}`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getTvLists = async (
  type: string = "popular",
  page: string = "1"
) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/tv/${type}?language=en-US&page=${page}`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getGenres = async (type: "movie" | "tv") => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/genre/${type}/list?language=en`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getLanguages = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/configuration/languages`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getKeyWords = async (query: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/search/keyword?query=${query}&page=1`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getDiscover = async (
  type: string = "movie",
  page: string = "1",
  sort_by: string = "",
  with_original_language: string = "",
  vote_average_gte: string = "",
  vote_average_lte: string = "",
  with_genres: string = "",
  with_keywords: string = "",
  release_date_gte: string = "",
  release_date_lte: string = ""
) => {
  // Build the query parameters dynamically
  const queryNameDateGte =
    type === "movie" ? "release_date.gte" : "first_air_date.gte";
  const queryNameDateLte =
    type === "movie" ? "release_date.lte" : "first_air_date.lte";
  const queryParams = new URLSearchParams({
    language: "en",
    page,
    ...(sort_by && { sort_by }),
    ...(with_original_language && { with_original_language }),
    ...(vote_average_gte && { "vote_average.gte": vote_average_gte }),
    ...(vote_average_lte && { "vote_average.lte": vote_average_lte }),
    ...(with_genres && { with_genres }),
    ...(with_keywords && { with_keywords }),
    ...(release_date_gte && { [queryNameDateGte]: release_date_gte }),
    ...(release_date_lte && { [queryNameDateLte]: release_date_lte }),
  });

  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/discover/${type}?${queryParams.toString()}`,
      options
    );

    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getMediaById = async (id: string, type: "tv" | "movie") => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/${type}/${id}?language=en-US`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMediaCredits = async (id: string, type: IMediaType) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/${type}/${id}/credits?language=en-US`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    return null;
  }
};

export const getMediaCrew = async (
  id: string,
  type: IMediaType,
  page: number = 1,
  limit: number = 20
) => {
  try {
    const credits: MovieAPICreditsResponse = await getMediaCredits(id, type);
    if (!credits) {
      throw new Error("Something went wrong!");
    }

    const crew = credits.crew;

    if (crew.length === 0) {
      throw new Error("Crew not found!");
    }

    const totalResults = crew.length;
    const totalPages = Math.ceil(totalResults / limit);
    const paginatedCrew = crew.slice((page - 1) * limit, page * limit);

    return {
      results: paginatedCrew,
      totalPages,
    };
  } catch (error) {
    return null;
  }
};

export const getMediaCast = async (
  id: string,
  type: IMediaType,
  page: number = 1,
  limit: number = 20
) => {
  try {
    const credits: MovieAPICreditsResponse = await getMediaCredits(id, type);
    if (!credits) {
      throw new Error("Something went wrong!");
    }

    if (credits.cast.length === 0) {
      throw new Error("Cast not found!");
    }

    const totalResults = credits.cast.length;
    const totalPages = Math.ceil(totalResults / limit);
    const paginatedCast = credits.cast.slice((page - 1) * limit, page * limit);

    return {
      results: paginatedCast,
      totalPages,
    };
  } catch (error) {
    return null;
  }
};

export const getMediaVidoes = async (id: string, type: "tv" | "movie") => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/${type}/${id}/videos?language=en-US`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMediaYoutubeVideos = async (
  id: string,
  type: "tv" | "movie"
) => {
  try {
    const videos: MovieApiVideoResponse = await getMediaVidoes(id, type);

    const youtubeVideos = videos.results.filter(
      (vid) => vid.site === "YouTube"
    );

    if (youtubeVideos.length === 0)
      throw new Error("Youtube vidoes not found.");

    return youtubeVideos;
  } catch (error) {
    console.log(error);
  }
};

export const getYoutubeMediaTrailer = async (
  id: string,
  type: "tv" | "movie"
) => {
  try {
    const videos = await getMediaYoutubeVideos(id, type);

    if (!videos || videos.length === 0) {
      throw new Error("Youtube Videos not found");
    }
    const trailer = videos.find((vid) => vid.type === "Trailer");

    if (!trailer) {
      throw new Error("Trailer not found");
    }

    return trailer;
  } catch (error) {
    console.log(error);
  }
};

export const getMediaKeywords = async (id: string, type: "tv" | "movie") => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/${type}/${id}/keywords`,
      options
    );

    return data;
  } catch (error) {
    return null;
  }
};
export const getMediaRecommendations = async (id: string, type: IMediaType) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/${type}/${id}/recommendations?language=en-US&page=1`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    if (data.tototal_results === 0) {
      throw new Error("No keywords found");
    }
    return data.results;
  } catch (error) {
    console.log(error);
  }
};
export const fetchMoviesByids = async (
  mediaItems: { tmdbId: string; type: string }[]
) => {
  try {
    const mediaPromises = mediaItems.map((item) =>
      axios.get(
        `${process.env.THE_MOVIE_DB_API_URL}/${item.type.toLowerCase()}/${
          item.tmdbId
        }type?language=en-US`,
        options
      )
    );
    const responses = await Promise.all(mediaPromises);

    const result = responses.map((response) => response.data);
    return result;
  } catch (error) {
    console.error("Error fetching media by IDs:", error);
    throw error;
  }
};
export const getTvShowSeasonDataById = async (
  id: string,
  season_number: string
) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/tv/${id}/season/${season_number}?language=en-US`,
      options
    );

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getTvShowEpisodeDataById = async (
  id: string,
  season_number: string,
  episode_number: string
) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/tv/${id}/season/${season_number}/episode/${episode_number}?language=en-US`,
      options
    );

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPersonById = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/person/${id}?language=en-US`,
      options
    );
    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    return null;
  }
};

export const getKnownForMedia = async (
  type: IMediaType,
  with_cast: string,
  page: string = "1"
) => {
  const queryParams = new URLSearchParams({
    language: "en",
    page,
    with_cast,
  });

  try {
    const { data } = await axios.get(
      `${
        process.env.THE_MOVIE_DB_API_URL
      }/discover/${type}?${queryParams.toString()}`,
      options
    );

    if (!data || data.errors) {
      throw new Error("Something went wrong!");
    }
    return data;
  } catch (error) {
    return null;
  }
};

export const getMediaBelongingToPerson = async (
  personId: string,
  type: IMediaType,
  page: number = 1,
  limit: number = 5
) => {
  try {
    const { data } = await axios.get(
      `${process.env.THE_MOVIE_DB_API_URL}/person/${personId}/${type}_credits?language=en-US`,
      options
    );

    const results = data.cast;

    if (!results.length) {
      return { results: [], totalPages: 0 };
    }

    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);

    const paginatedResults = results.slice((page - 1) * limit, page * limit);
    return {
      results: paginatedResults,
      totalPages,
    };
  } catch (error) {
    return null;
  }
};
