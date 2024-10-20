import { create } from "zustand";

interface ToggleSearchInput {
  isOpen: boolean;
  toggle: () => void;
}

export const useToggleSearchInput = create<ToggleSearchInput>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

interface SetDate {
  date: "day" | "week";
  setDay: () => void;
  setWeek: () => void;
}
export const useSetDate = create<SetDate>((set) => ({
  date: "day",
  setDay: () => set({ date: "day" }),
  setWeek: () => set({ date: "week" }),
}));

interface SetProfilePicture {
  file: File | null;
  setFile: (file: File | null) => void;
}
export const useUploadProfilePicture = create<SetProfilePicture>((set) => ({
  file: null,
  setFile: (file: File | null) => set({ file }),
}));

type Iview = "image" | "security";

interface SetProfileSettingsView {
  view: Iview;
  setView: (view: Iview) => void;
}

export const SwitchProfileSettingsView = create<SetProfileSettingsView>(
  (set) => ({
    view: "image",
    setView: (view: Iview) => set({ view }),
  })
);

interface ISetAuthorizedDialog {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useSetAuthorizedDialog = create<ISetAuthorizedDialog>((set) => ({
  open: false,
  setOpen: (open) => set(() => ({ open })),
}));
