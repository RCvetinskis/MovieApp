using FavoriteMovieAppBackEnd.Data;

namespace FavoriteMovieAppBackEnd.Models.Entities
{
    public class Favorites
    {

        public Guid Id { get; set; }

        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public required Guid MediaItemId { get; set; }
        public MediaItem? MediaItem { get; set; }



        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
