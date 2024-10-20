import CastCrewNav from "../../../_components/castAndCrew/cast-crew-nav";
import CastGrid from "../../../_components/castAndCrew/cast-grid";
import CrewGrid from "../../../_components/castAndCrew/crew-grid";

type Props = {
  params: {
    id?: string;
  };
  searchParams: {
    display?: string;
    page?: string;
  };
};

const MovieCastPage = ({ params, searchParams }: Props) => {
  const id = params.id;
  const display = searchParams.display || "cast";
  const page = Number(searchParams.page) || 1;

  if (!id) return <div className="text-lg">Page not found</div>;

  return (
    <div className="space-y-4">
      <header>
        <CastCrewNav />
      </header>
      <main>
        {display === "cast" ? (
          <CastGrid id={id} type="movie" page={page} />
        ) : (
          <CrewGrid id={id} type="movie" page={page} />
        )}
      </main>
    </div>
  );
};

export default MovieCastPage;
