import { getUserById } from "@/actions/backend/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
type Props = {};

const ProfilePage = async (props: Props) => {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  // TODO: Crud for user operations, edit username,password,change image
  // TODO: Create notifications and notifcations managment

  // fix navigation from tv list to tv with id in middleware or find other solution
  if (!userId) redirect("/login");
  const user = await getUserById(userId);

  return <div></div>;
};

export default ProfilePage;
