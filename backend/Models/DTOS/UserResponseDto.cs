namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class UserResponseDto
    {
        public required string Id { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }

        public string? ProfileImageUrl { get; set; }


        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastLogin { get; set; } = DateTime.UtcNow;
    }
}
