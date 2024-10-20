namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class CommentDto
    {

        public Guid Id { get; set; }
        public required string PostId { get; set; }
        public required string UserId { get; set; }
        public required string Message { get; set; }

        public Guid? ParentCommentId { get; set; }


        public int? ReplyCount { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
