import MyLists from "./_components/my-lists";
import NavToNewListBtn from "./_components/nav-to-new-list-btn";
import { getWatchListsByUserId } from "@/actions/backend/watchlist-serverside";
import PaginationContainer from "@/components/pagination/pagination-container";
import { limit } from "@/lib/constants";

type Props = {
  searchParams: {
    page?: string;
  };
};

const WatchListPage = async ({ searchParams }: Props) => {
  const page = Number(searchParams.page) || 1;

  const data = await getWatchListsByUserId(page, limit);
  let content;
  let totalPages = 1;
  if (!data) {
    content = <div>No results found</div>;
  } else {
    totalPages = data.totalPages;
    content = <MyLists watchlists={data.watchlists} />;
  }

  return (
    <div className="space-y-6">
      <header className="flex  items-center justify-between">
        <h1>My lists</h1>
        <NavToNewListBtn />
      </header>

      <main>{content}</main>

      <footer className="pt-6">
        <PaginationContainer totalPages={totalPages} />
      </footer>
    </div>
  );
};

export default WatchListPage;
