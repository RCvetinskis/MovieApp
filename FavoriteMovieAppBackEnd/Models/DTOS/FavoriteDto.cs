using FavoriteMovieAppBackEnd.Models.Entities;

namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class FavoriteDto
    {
        public required Guid Id { get; set; }
        public required string UserId { get; set; }

        public MediaItem? MediaItem { get; set; }

    }
}
