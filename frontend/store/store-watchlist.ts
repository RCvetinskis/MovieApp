import { IWatchListPostRequest } from "@/types";
import { create } from "zustand";

// Store for managing the watchlist
interface IWatchListStore {
  watchlistId: string | null;
  setWatchlistId: (watchlistId: string | null) => void;
  watchList: IWatchListPostRequest;
  setWatchListName: (name: string) => void;
  setWatchListPublic: (isPublic: boolean) => void;
  setWatchListDescription: (description: string) => void;
  setWatchListImage: (image: string) => void;
  addMediaItem: (item: any) => void;
  removeMediaItem: (tmdbId: string) => void;
  resetWatchListValues: () => void;
}

// Create Zustand store
export const useWatchListStore = create<IWatchListStore>((set) => ({
  watchlistId: null,
  setWatchlistId: (value: string | null) => set(() => ({ watchlistId: value })),
  watchList: {
    name: "",
    public: true,
    description: "",
    mediaItems: [],
    imageUrl: "",
  },

  // Update watchlist name
  setWatchListName: (name: string) =>
    set((state) => ({
      watchList: {
        ...state.watchList,
        name,
      },
    })),

  // Update public status
  setWatchListPublic: (isPublic: boolean) =>
    set((state) => ({
      watchList: {
        ...state.watchList,
        public: isPublic,
      },
    })),

  // Update description
  setWatchListDescription: (description: string) =>
    set((state) => ({
      watchList: {
        ...state.watchList,
        description,
      },
    })),

  // Update watchlist image
  setWatchListImage: (imageUrl: string) =>
    set((state) => ({
      watchList: {
        ...state.watchList,
        imageUrl,
      },
    })),

  // Add media item to watchlist
  addMediaItem: (item: any) =>
    set((state) => {
      const itemExists = state.watchList.mediaItems?.some(
        (mediaItem) => mediaItem.id === item.id && mediaItem.type === item.type
      );
      if (!itemExists) {
        return {
          watchList: {
            ...state.watchList,
            mediaItems: [...(state.watchList.mediaItems || []), item],
          },
        };
      }
      return state;
    }),

  removeMediaItem: (tmdbId: string) =>
    set((state) => ({
      watchList: {
        ...state.watchList,
        mediaItems: state.watchList.mediaItems?.filter(
          (mediaItem) => mediaItem.id.toString() !== tmdbId
        ),
      },
    })),
  resetWatchListValues: () =>
    set(() => ({
      watchList: {
        name: "",
        public: true,
        description: "",
        mediaItems: [],
        imageUrl: "",
      },
      watchlistId: null,
    })),
}));
