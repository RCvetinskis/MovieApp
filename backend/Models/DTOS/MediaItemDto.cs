namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class MediaItemDto
    {
        public string Type { get; set; } = string.Empty;
        public string TmdbId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;

        public DateTime? LastEpisodeDate { get; set; }
        public DateTime? NextEpisodeDate { get; set; }
        public DateTime AddedAt { get; set; }
    }
}
