import { limit } from "@/lib/constants";
import RecommendationsContainer from "../../_components/recommendations-container";
import CommentsContainer from "../../_components/comments/comments-container";
import { getCommentsByPostId } from "@/actions/backend/comment-server";
import CastCarousel from "../../_components/castAndCrew/cast-carousel";

type Props = {
  params: {
    id: string;
  };
};

const TvDetailsPage = async ({ params }: Props) => {
  const id = params.id;
  if (!id) return <div>Page not found</div>;
  const postId = `tv${id}`;
  const comments = await getCommentsByPostId(postId, 1, limit);
  return (
    <div className="space-y-8 ">
      <main className="space-y-4 p-4">
        <CastCarousel id={id} type="tv" />

        <RecommendationsContainer id={id} type="tv" />

        <CommentsContainer comments={comments} postId={postId} />
      </main>
    </div>
  );
};

export default TvDetailsPage;
