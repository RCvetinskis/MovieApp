import { cookies } from "next/headers";
import { lazy, Suspense } from "react";
import { FavoritePageContentSkeleton } from "./_components/favorites-page-content";

type Props = {
  searchParams: {
    page?: string;
    type?: string;
  };
};

const FavoritesPage = async ({ searchParams }: Props) => {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  const FavoritePageContent = lazy(
    () => import("./_components/favorites-page-content")
  );

  return (
    <div>
      <Suspense fallback={<FavoritePageContentSkeleton />}>
        {userId && (
          <FavoritePageContent userId={userId} searchParams={searchParams} />
        )}
      </Suspense>
    </div>
  );
};

export default FavoritesPage;
