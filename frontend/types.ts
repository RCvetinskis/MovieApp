export interface Route {
  href?: string;
  label?: string;
  active?: boolean;
  Component: React.ComponentType<any>;
}

export type MovieApiResponse = {
  results: any[];
  total_results: number;
  total_pages: number;
};

export type SortOptions = {
  value: string;
  label: string;
};

export type Genre = {
  id: number;
  name: string;
};
export type Language = {
  iso_639_1: string;
  english_name: string;
  name: string;
};

export type KeyWordType = {
  id: number;
  name: string;
};

interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

// Type for production companies
export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

// Type for production countries
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

// Type for spoken languages
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Main Movie interface
export interface Movie {
  adult: boolean;
  backdrop_path?: string;
  belongs_to_collection?: BelongsToCollection;
  budget: number;
  genres: Genre[];
  homepage?: string;
  id: number;
  imdb_id?: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime?: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline?: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// cast/crew

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface MovieAPICreditsResponse {
  id: number | string;
  cast: Cast[] | [];
  crew: Crew[] | [];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface MovieApiVideoResponse {
  id: string | number;
  results: Video[] | [];
}

export interface Iuser {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  profileImageUrl: string;
}

export interface IFavoriteResponse {
  id: string;
  userId: string;
  mediaItem: IMediaItem;
}

export interface IFavorite {
  id: string;
  type: IMediaType;
  tmdbId: string;
  createdAt: string;
}

export interface IFavoritesListResponse {
  totalFavorites: number;
  page: number;
  limit: number;
  totalPages: number;
  favorites: IFavorite[];
}

export interface IWatchListPostRequest {
  name: string;
  public: boolean;
  description: string;
  mediaItems: any[] | [];
  imageUrl: string;
}
export interface IWatchListPatchRequest {
  name: string | null;
  public: boolean | null;
  description: string | null;
  mediaItems?: any[] | null;
  imageUrl: string | null;
}

// type for add user
export interface IWatchListResponse {
  id: string;
  name: string;
  public: boolean;
  description?: string;
  mediaItemsTotal?: number;
  imageUrl?: string;
  createdAt: string;
}
export interface IMediaItem {
  id: string;
  tmdbId: string;
  type: IMediaType;
  title?: string;
  lastEpisodeDate?: string;
  nextEpisodeDate?: string;
  addedAt?: string;
}
export type IMediaItemsResponse = {
  page: number;
  totalPages: number;
  totalItems: number;
  mediaItems: IMediaItem[] | [];
};

export type IMediaItemsApiResposne = {
  message: string;
  response: IMediaItemsResponse;
};

export type IMockLikes = {
  likes: string[];
  likesCount: number;
  dislikes: string[];
  dislikesCount: number;
  commentId: string;
};
export type IMockComment = {
  userId: string;
  commentId: string;
  comment: string;
  createdAt: string;
  likes?: string[];
  dislikes?: string[];
  likesCount?: number;
  dislikesCount?: number;
  replies?: IMockComment[];
};

export interface IComment {
  id: string;
  postId: string;
  userId: string;
  message: string;
  createdAt: string;
  replyCount: number;
  parentCommentId?: string;
}

export interface ICommentsResponse {
  message: string;
  response: {
    page: number;
    totalPages: number;
    limit: number;
    totalComments: number;
    comments: IComment[];
  };
}

export interface ILike {
  id: string;
  commentId: string;
  userId: string;
  createdAt: string;
  totalLikes: number;
}
export interface IDislike {
  id: string;
  commentId: string;
  userId: string;
  createdAt: string;
  totalDislikes: number;
}

export type IMediaType = "tv" | "movie";

export interface ISeason {
  air_date?: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  season_number: number;
  vote_average: number;
}

export interface IEpisode {
  air_date: string;
  crew: ICrew[];
  episode_number: number;
  guest_stars: IGuestStar[];
  name: string;
  overview: string;
  id: number;
  production_code: string;
  runtime: number;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ICrew {
  job: string;
  department: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
}

export interface IGuestStar {
  character: string;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path?: string;
}

export interface IPerson {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: any;
  gender: number;
  homepage: any;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

export interface IMediaItemForReactProps {
  tmdbId: string;
  type: IMediaType;
  title?: string;
  lastEpisodeDate?: string;
  nextEpisodeDate?: string;
}

export interface IAirDates {
  lastEpisodeDate?: string;
  nextEpisodeDate?: string;
}

export interface INotification {
  id: string;
  userId: string;
  message: string;
  isSeen?: boolean;
  createdAt?: string;
}
