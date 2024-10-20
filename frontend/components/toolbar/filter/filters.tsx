import { CardContent } from "@/components/ui/card";
import OpenDrawer, { OpenDrawerHeaderSkeleton } from "../open-drawer";
import GenresContainer, {
  GenresContainerSkeleton,
} from "./genre/genres-container";
import Languages, { LanguagesSkeleton } from "./languages";
import { Separator } from "@/components/ui/separator";
import SelectDate, { SelectDateSkeleton } from "./select-date";
import SlideScore, { SlideScoreSkeleton } from "./slide-score";
import KeyWords, { KeyWordsSkeleton } from "./keywords";
import { getGenres, getLanguages } from "@/actions/tmdb api/getRequests";
import { headers } from "next/headers";

const Filters = async () => {
  // getting pathname in server-side
  const headersList = headers();
  const pathname = headersList.get("x-pathname");
  const urlPath = pathname || "/movie";

  const type = urlPath.split("/")[1] || "";
  if (type !== "tv" && type !== "movie")
    return <div>Something went wrong!</div>;
  const generes = await getGenres(type);

  const languages = await getLanguages();
  return (
    <OpenDrawer title="Filters">
      <CardContent className="p-2 pb-4 space-y-4">
        <KeyWords />
        <Separator />
        <GenresContainer data={generes.genres} />
        <Separator />
        <Languages data={languages} />
        <Separator />
        <SelectDate />
        <Separator />
        <SlideScore />
      </CardContent>
    </OpenDrawer>
  );
};

export default Filters;

export const FiltersSkeleton = () => {
  return (
    <div className="bg-card shadow rounded-xl">
      <OpenDrawerHeaderSkeleton />

      <KeyWordsSkeleton />
      <Separator />
      <GenresContainerSkeleton />
      <Separator />
      <LanguagesSkeleton />
      <Separator />
      <SelectDateSkeleton />
      <Separator />
      <SlideScoreSkeleton />
    </div>
  );
};
