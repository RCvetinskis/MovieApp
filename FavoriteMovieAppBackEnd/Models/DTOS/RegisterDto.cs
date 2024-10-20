using System.ComponentModel.DataAnnotations;

namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class RegisterDto
    {

        public required string Email { get; set; }

        [MaxLength(50)]
        public required string UserName { get; set; }
        public required string Password { get; set; }
    }
}
