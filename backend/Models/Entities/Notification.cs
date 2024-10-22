using FavoriteMovieAppBackEnd.Data;
using System.ComponentModel.DataAnnotations;

namespace FavoriteMovieAppBackEnd.Models.Entities
{
    public class Notification
    {
        public Guid Id { get; set; }

        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }

        [MaxLength(255)]
        public required string Message { get; set; }

        public Boolean IsSeen { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}
