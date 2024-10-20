using System.ComponentModel.DataAnnotations;

namespace FavoriteMovieAppBackEnd.Models.DTOS
{
    public class AddWatchlistDto
    {


        public required string Name { get; set; }

        public Boolean Public { get; set; } = true;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public List<MediaItemDto> MediaItems { get; set; } = new List<MediaItemDto>();
        public string? ImageUrl { get; set; }

    }


}
