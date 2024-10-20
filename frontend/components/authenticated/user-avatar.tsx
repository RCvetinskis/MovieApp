import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

type Props = {
  imageUrl?: string;
  className?: string;
};

const UserAvatar = ({ imageUrl, className }: Props) => {
  const image = imageUrl ? imageUrl : "/assets/avatar.jpg";
  return (
    <Avatar className={cn("w-8 h-8", className)}>
      <AvatarImage src={image} alt="@shadcn" />
      <AvatarFallback>PP</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

export const UserAvatarSkeleton = () => {
  return (
    <Skeleton className="h-8 w-8 bg-gray-500 aspect-square rounded-full" />
  );
};
