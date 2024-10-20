"use client";

import { Iuser } from "@/types";
import EditProfileForm from "./EditProfileForm";
import { SwitchProfileSettingsView } from "@/store/store";
import UploadProfilePicture from "./UploadProfilePicture";

type Props = {
  user: Iuser;
};

const Content = ({ user }: Props) => {
  const { view } = SwitchProfileSettingsView();
  return (
    <div>
      {view === "image" ? (
        <UploadProfilePicture
          userId={user.id}
          existingImage={user.profileImageUrl}
        />
      ) : (
        <EditProfileForm userId={user.id} userName={user.userName} />
      )}
    </div>
  );
};

export default Content;
