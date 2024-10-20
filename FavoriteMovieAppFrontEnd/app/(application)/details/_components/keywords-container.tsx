import { getMediaKeywords } from "@/actions/tmdb api/getRequests";
import { Badge } from "@/components/ui/badge";
import { KeyWordType } from "@/types";
import React from "react";

type Props = {
  id: string;
  type: "tv" | "movie";
};

const KeyWordsContainer = async ({ id, type }: Props) => {
  const result = await getMediaKeywords(id, type);

  const keywords: KeyWordType[] | null =
    type === "movie" ? result.keywords : result.results;

  return (
    <>
      {keywords && (
        <div className="flex flex-wrap gap-3">
          {keywords.map((item) => (
            <Badge className="capitalize" variant={"secondary"} key={item.id}>
              {item.name}
            </Badge>
          ))}
        </div>
      )}
    </>
  );
};

export default KeyWordsContainer;
