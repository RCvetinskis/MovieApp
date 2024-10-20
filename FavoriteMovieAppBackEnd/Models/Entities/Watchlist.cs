using FavoriteMovieAppBackEnd.Data;
using System.ComponentModel.DataAnnotations;

namespace FavoriteMovieAppBackEnd.Models.Entities
{
    public class Watchlist
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }

        public Boolean Public { get; set; } = true;

        [MaxLength(1000)]
        public string? Description { get; set; }


        public string? ImageUrl { get; set; }


        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        public ICollection<MediaItem> MediaItems { get; set; } = new List<MediaItem>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    }


}
