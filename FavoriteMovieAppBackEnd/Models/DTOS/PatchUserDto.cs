namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class PatchUserDto
    {

        public string? UserName { get; set; }
        public string? CurrentPassword { get; set; }
        public string? Password { get; set; }

    }
}
