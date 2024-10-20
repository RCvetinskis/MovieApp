namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class WebSocketDto
    {
        public required string PostId { get; set; }
        public required string UserId { get; set; }
        public required string Message { get; set; }
    }
}
