import { IEpisode } from "@/types";
import React from "react";
import EpisodeCard from "./episode-card";

type Props = {
  episodes: IEpisode[];
};

const EpisodesContainer = ({ episodes }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {episodes.map((item) => (
        <EpisodeCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default EpisodesContainer;
