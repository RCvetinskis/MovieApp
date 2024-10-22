"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../ui/button";
import NotifiyBell from "../notification/notifiy-bell";
import { useNotificationsStore } from "@/store/store-notification";
import { useEffect, useMemo } from "react";
import { useUserStore } from "@/store/store-user";
import {
  getUserNotifications,
  markNotificationsAsSeen,
} from "@/actions/backend/notification";
import Link from "next/link";

const NavNotification = () => {
  const { user } = useUserStore();
  const { notifications, setNotifications, markAllAsSeen } =
    useNotificationsStore();

  useEffect(() => {
    // gets first 10 notifications to display
    const fetchUserNotifications = async () => {
      const result = await getUserNotifications(1, 10, "false");
      setNotifications(result.notifications);
    };

    fetchUserNotifications();
  }, [user]);

  const handleMarkSeen = async () => {
    const notificationIds = notifications
      .filter((notification) => !notification.isSeen)
      .map((notification) => notification.id);

    if (!notificationIds.length) return;

    await markNotificationsAsSeen(notificationIds);
    markAllAsSeen();
  };

  const unSeenNotifications = useMemo(
    () => notifications.filter((notification) => notification.isSeen === false),
    [notifications]
  );

  const hasNewNotifications = unSeenNotifications.length > 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="p-0 px-2 rounded-full "
          variant={"ghost"}
          size={"sm"}
        >
          <NotifiyBell
            notificationsCount={unSeenNotifications.length}
            color={"white"}
            className={hasNewNotifications ? "animate-pulse" : ""}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-w-xs max-h-[50vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>Notifications</span>
            <NotifiyBell
              notificationsCount={unSeenNotifications.length}
              color={"white"}
            />
          </div>
          {hasNewNotifications && (
            <Button onClick={handleMarkSeen} variant={"ghost"}>
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {!hasNewNotifications ? (
          <div className="p-2 text-sm text-center text-gray-500">
            No notifications
          </div>
        ) : (
          unSeenNotifications.map((notification) => (
            <div key={notification.id}>
              <p className="text-sm p-1">{notification.message}</p>
              <DropdownMenuSeparator />
            </div>
          ))
        )}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-sm text-muted-foreground">
          <Link href={"profile/notifications"}>
            <Button variant={"link"}>View All Notifications</Button>
          </Link>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavNotification;
