import { getFavoritesListByUserId } from "@/actions/backend/favorites-serverside";
import CardsContainer, {
  CardsContainerSkeleton,
} from "@/components/cards/cards-container";
import PaginationContainer, {
  PaginationContainerSkeleton,
} from "@/components/pagination/pagination-container";
import TitleSkeleton from "@/components/skeletons/title-skeleton";
import { limit } from "@/lib/constants";
import { IFavoritesListResponse } from "@/types";
import ToggleType from "./toggle-type";
import { fetchMediaItemsByids } from "@/actions/tmdb api/getRequests";
import SearchFilterContainer from "../../_components/search-filter-container";

type Props = {
  userId: string;
  searchParams: {
    page?: string;
    type?: string;
    query?: string;
    sortBy?: string;
  };
};

const FavoritePageContent = async ({ userId, searchParams }: Props) => {
  const page = Number(searchParams.page) || 1;
  const type = searchParams.type;
  const query = searchParams.query;
  const sortBy = searchParams.sortBy;

  const favoritesIds = (await getFavoritesListByUserId(
    userId,
    page,
    limit,
    type,
    query,
    sortBy
  )) as IFavoritesListResponse;

  const Content = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="space-y-6">
        <header className="space-y-4">
          <h1 className="text-xl md:text-3xl font-semibold mb-4">Favorites</h1>

          <ToggleType />
          <SearchFilterContainer />
        </header>

        <main>{children}</main>

        <footer className="py-6">
          <PaginationContainer totalPages={favoritesIds.totalPages || 1} />
        </footer>
      </div>
    );
  };

  if (!favoritesIds || favoritesIds.totalFavorites === 0) {
    return (
      <Content>
        <div>You have no favorite media saved</div>
      </Content>
    );
  }

  const favorites = await fetchMediaItemsByids(favoritesIds.favorites);

  if (!favorites || favorites.length === 0) {
    return (
      <Content>
        <div>No results found</div>
      </Content>
    );
  }

  return (
    <Content>
      <CardsContainer results={favorites} />
    </Content>
  );
};

export default FavoritePageContent;

export const FavoritePageContentSkeleton = () => {
  return (
    <div>
      <div className="mb-4">
        <TitleSkeleton />
      </div>

      <main>
        <CardsContainerSkeleton />
      </main>

      <footer className="py-6">
        <PaginationContainerSkeleton />
      </footer>
    </div>
  );
};
