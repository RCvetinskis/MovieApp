import { Genre, KeyWordType } from "@/types";
import { create } from "zustand";

interface FilterStore {
  language?: string;
  setLanguage: (value: string) => void;
  keyword: KeyWordType | null;
  setKeyword: (value: KeyWordType | null) => void;
  genres: Genre[];
  setGenre: (value: Genre | Genre[]) => void;
  releaseDateFrom?: string;
  setReleaseDateFrom: (date: string) => void;
  releaseDateTo?: string;
  setReleaseDateTo: (date: string) => void;
  scoreFrom?: string;
  setScoreFrom: (score: string) => void;
  scoreTo?: string;
  setScoreTo: (score: string) => void;
  // sort
  sortBy?: string;
  setSortBy: (value: string) => void;
}

export const useSearchFilterStore = create<FilterStore>((set) => ({
  setLanguage: (value) => set({ language: value }),
  keyword: null,
  setKeyword: (value) => set({ keyword: value }),
  genres: [],
  setGenre: (value) =>
    set((state) => {
      const genreArray = Array.isArray(value) ? value : [value];
      const currentGenres = new Set(state.genres.map((genre) => genre.id)); // Using a Set for efficient lookup
      const newGenres = genreArray.filter(
        (genre) => !currentGenres.has(genre.id)
      ); // Filter out genres to add
      const removedGenres = state.genres.filter(
        (genre) => !genreArray.some((g) => g.id === genre.id)
      ); // Filter out genres to remove

      return {
        genres: [...removedGenres, ...newGenres], // Merge the filtered lists
      };
    }),

  releaseDateFrom: undefined,
  setReleaseDateFrom: (date) => set({ releaseDateFrom: date }),
  releaseDateTo: undefined,
  setReleaseDateTo: (date) => set({ releaseDateTo: date }),

  setScoreFrom: (score) => set({ scoreFrom: score }),

  setScoreTo: (score) => set({ scoreTo: score }),
  setSortBy: (value) => set({ sortBy: value }),
}));
