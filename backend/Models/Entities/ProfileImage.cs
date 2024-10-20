using FavoriteMovieAppBackEnd.Data;

namespace FavoriteMovieAppBackEnd.Models.Entities
{
    public class ProfileImage
    {
        public Guid Id { get; set; }
        public required string FileName { get; set; }
        public required string FilePath { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;


        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
