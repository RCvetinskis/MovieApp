"use client";
import { INotification } from "@/types";
import { create } from "zustand";

interface NotificationStore {
  notifications: INotification[] | [];
  setNotifications: (notifications: INotification[]) => void;
  markOneAsSeen: (notificationId: string) => void;
  markAllAsSeen: () => void;
}

export const useNotificationsStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  setNotifications: (notifications: INotification[]) => set({ notifications }),
  markOneAsSeen: (notificationId) => {
    const updatedNotifications = get().notifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, isSeen: true }
        : notification
    );
    set({ notifications: updatedNotifications });
  },
  markAllAsSeen: () => {
    const updatednotifications = get().notifications.map((notification) => ({
      ...notification,
      isSeen: true,
    }));
    set({ notifications: updatednotifications });
  },
}));
