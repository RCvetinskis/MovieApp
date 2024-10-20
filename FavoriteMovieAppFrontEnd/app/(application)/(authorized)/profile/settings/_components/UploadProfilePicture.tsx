"use client";
import { patchUserImage } from "@/actions/backend/user";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/ui/file-upload";
import useUser from "@/hooks/useUser";
import { useUploadProfilePicture } from "@/store/store";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  userId: string;
  existingImage: string;
};

const UploadProfilePicture = ({ userId, existingImage }: Props) => {
  const { file, setFile } = useUploadProfilePicture();
  const { mutate } = useUser();
  const defaultImage = "/assets/avatar.jpg";

  const imageSrc = file
    ? URL.createObjectURL(file)
    : existingImage || defaultImage;

  const handleFileChange = (files: File[]) => {
    setFile(files[0]);
  };

  const [isPending, startTransition] = useTransition();
  function onUpload() {
    if (!file) return null;
    const body = new FormData();

    body.append("newImage", file);
    startTransition(() => {
      patchUserImage(userId, body)
        .then((res) => {
          toast.success(res.message);
          mutate();
        })
        .catch((e) => toast.error(e.message));
    });
  }

  return (
    <div className="flex w-full flex-col gap-4 items-center">
      <div className="rounded-full p-1 border">
        <img
          src={imageSrc}
          alt="profile picture"
          width={200}
          height={200}
          className="aspect-square object-cover rounded-full"
        />
      </div>

      <div className="w-full   border border-dashed  rounded-lg">
        <FileUpload onChange={handleFileChange} />
      </div>
      <Button
        onClick={onUpload}
        className="w-full"
        size={"lg"}
        variant={"shimmer"}
        disabled={isPending}
      >
        Upload
      </Button>
    </div>
  );
};

export default UploadProfilePicture;
