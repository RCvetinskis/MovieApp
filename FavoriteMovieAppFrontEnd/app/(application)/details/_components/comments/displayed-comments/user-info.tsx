"use client";
import UserAvatar, {
  UserAvatarSkeleton,
} from "@/components/authenticated/user-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUser from "@/hooks/use-get-user";
import { timeAgo } from "@/lib/utils";

type Props = {
  userId: string;
  createdAt: string;
};

const UserInfo = ({ userId, createdAt }: Props) => {
  const { user, loading } = useGetUser(userId);

  if (loading) return <UserInfoSkeleton />;

  return (
    <div className="flex items-center gap-2 text-xs">
      <UserAvatar className="w-10 h-10" imageUrl={user?.profileImageUrl} />
      <p> {user?.userName}</p>

      <p className="text-muted-foreground">{timeAgo(createdAt)}</p>
    </div>
  );
};

export default UserInfo;

export const UserInfoSkeleton = () => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <UserAvatarSkeleton />
      <Skeleton className="w-12 h-3 bg-gray-500" />

      <Skeleton className="w-14 h-3 bg-gray-500" />
    </div>
  );
};
