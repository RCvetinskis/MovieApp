import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/backend/user";
import { Iuser } from "@/types";
import SwitchSettings from "./_components/Switch-Settings";
import Content from "./_components/content";

type Props = {};

const ProfileSettingsPage = async (props: Props) => {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) redirect("/login");
  const user = (await getUserById(userId)) as Iuser;

  return (
    <div className=" space-y-4">
      <header>
        <SwitchSettings />
      </header>

      <main>
        <Content user={user} />
      </main>
    </div>
  );
};

export default ProfileSettingsPage;
