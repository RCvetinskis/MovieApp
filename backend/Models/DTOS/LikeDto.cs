namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class LikeDto
    {

        public Guid Id { get; set; }
        public required string UserId { get; set; }
        public Guid CommentId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
