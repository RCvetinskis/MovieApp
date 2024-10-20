using FavoriteMovieAppBackEnd.Data;

namespace FavoriteMovieAppBackEnd.Models.Entities
{
    public class Dislikes
    {

        public Guid Id { get; set; }


        public required string UserId { get; set; }

        public ApplicationUser? User { get; set; }

        public Guid CommentId { get; set; }

        public Comment? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}
