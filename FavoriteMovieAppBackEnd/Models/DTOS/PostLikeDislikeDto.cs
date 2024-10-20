namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class PostLikeDislikeDto
    {
        public required string UserId { get; set; }

        public required string CommentId { get; set; }
    }
}
