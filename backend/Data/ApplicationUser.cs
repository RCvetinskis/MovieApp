using FavoriteMovieAppBackEnd.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace FavoriteMovieAppBackEnd.Data
{
    public class ApplicationUser : IdentityUser


    {

        public bool IsAdmin { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastLogin { get; set; } = DateTime.UtcNow;

        // Relationship with ProfileImage
        public ProfileImage? ProfileImage { get; set; }

        // One-to-Many Relationship with Comments
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();


        // One-to-Many Relationships with Likes and Dislikes
        public ICollection<Likes> Likes { get; set; } = new List<Likes>();
        public ICollection<Dislikes> Dislikes { get; set; } = new List<Dislikes>();

        // Relationship with Favorites and Watchlist
        public ICollection<Favorites> Favorites { get; set; } = new List<Favorites>();
        public ICollection<Watchlist> Watchlist { get; set; } = new List<Watchlist>();

        // One-to-many notiifications
        public ICollection<Notification> Notification { get; set; } = new List<Notification>();


    }
}
