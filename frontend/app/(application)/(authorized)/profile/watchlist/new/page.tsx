import ListNavigation from "../_components/list-navigation";
import NewWatchlistContainer from "./_components/new-watchlist.container";

type Props = {
  searchParams: {
    navStep?: string;
  };
};

const NewWatchListPage = ({ searchParams }: Props) => {
  const { navStep } = searchParams;

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1>Create new list</h1>

        <ListNavigation isEdit={false} />
      </header>

      <NewWatchlistContainer navStep={navStep} />
    </div>
  );
};

export default NewWatchListPage;
