using FavoriteMovieAppBackEnd.Data;
using System.ComponentModel.DataAnnotations;

namespace FavoriteMovieAppBackEnd.Models.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }

        public required string PostId { get; set; }



        public required string UserId { get; set; }
        public ApplicationUser? User { get; set; }


        [MaxLength(1000)]
        public required string Message { get; set; }


        public Guid? ParentCommentId { get; set; }

        public Comment? ParentComment { get; set; }

        // Collection for replies (self-referencing one-to-many)
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();


        public List<Likes> Likes { get; set; } = new List<Likes>();
        public List<Dislikes> Dislikes { get; set; } = new List<Dislikes>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
