export const tmdbImageUrl = "https://image.tmdb.org/t/p/w500";

export const categories = ["multi", "movie", "tv", "person"];

export const sortMovieOptions = [
  {
    value: "popularity.asc",
    label: "Popoularity Ascending",
  },
  {
    value: "popularity.desc",
    label: "Popoularity Descending",
  },

  {
    value: "vote_average.asc",
    label: "Rating Ascending",
  },
  {
    value: "vote_average.desc",
    label: "Rating Descending",
  },
  {
    value: "primary_release_date.asc",
    label: "Release Date Ascending",
  },
  {
    value: "primary_release_date.desc",
    label: "Release Date Descending",
  },
  {
    value: "title.asc",
    label: "Title (A-Z)",
  },
  {
    value: "title.desc",
    label: "Title (Z-A)",
  },
];
export const sortTvOptions = [
  {
    value: "popularity.asc",
    label: "Popoularity Ascending",
  },
  {
    value: "popularity.desc",
    label: "Popoularity Descending",
  },

  {
    value: "vote_average.asc",
    label: "Rating Ascending",
  },
  {
    value: "vote_average.desc",
    label: "Rating Descending",
  },
  {
    value: "first_air_date.asc",
    label: "First Air Date Ascending",
  },
  {
    value: "first_air_date.desc",
    label: "First Air Date Descending",
  },
  {
    value: "name.asc",
    label: "Title (A-Z)",
  },
  {
    value: "name.desc",
    label: "Title (Z-A)",
  },
];

// navigation options for dropdownmenu
export const movieNavOpts = [
  {
    value: "/movie",
    label: "Popular",
  },
  {
    value: "/movie/now_playing",
    label: "Now Playing",
  },
  {
    value: "/movie/upcoming",
    label: "Upcoming",
  },
  {
    value: "/movie/top_rated",
    label: "Top Rated",
  },
];
export const tvNavOpts = [
  {
    value: "/tv",
    label: "Popular",
  },
  {
    value: "/tv/airing_today",
    label: "Airing today",
  },
  {
    value: "/tv/on_the_air",
    label: "On The Air",
  },
  {
    value: "/tv/top_rated",
    label: "Top Rated",
  },
];
export const userNavopts = [
  {
    value: "/profile",
    label: "Profile",
  },
  {
    value: "/profile/settings",
    label: "Profile settings",
  },
];

export const limit = 10;
