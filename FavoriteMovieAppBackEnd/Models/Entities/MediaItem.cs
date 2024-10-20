using FavoriteMovieAppBackEnd.Lib;

namespace FavoriteMovieAppBackEnd.Models.Entities
{
    public class MediaItem
    {
        public Guid Id { get; set; }
        public required Enums.MediaType Type { get; set; }
        public required string TmdbId { get; set; }
        public string Title { get; set; } = string.Empty;


        public Guid? WatchlistId { get; set; }
        public Watchlist? Watchlist { get; set; }

        public Guid? FavoriteId { get; set; }
        public Favorites? Favorite { get; set; }

        public DateTime? LastEpisodeDate { get; set; }
        public DateTime? NextEpisodeDate { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}
