import { ISeason } from "@/types";
import SeasonCard from "./season-card";

type Props = {
  seasons: ISeason[];
};

const SeasonsContainer = async ({ seasons }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {seasons.map((item) => (
        <SeasonCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default SeasonsContainer;
