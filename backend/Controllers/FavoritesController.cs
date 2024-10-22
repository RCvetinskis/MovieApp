using FavoriteMovieAppBackEnd.Data;
using FavoriteMovieAppBackEnd.Lib;
using FavoriteMovieAppBackEnd.Models.DTOS;
using FavoriteMovieAppBackEnd.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;

namespace FavoriteMovieAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public FavoritesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // Helper method to validate user
        private async Task<ApplicationUser?> GetUserByIdAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        // Helper method to parse media type
        private bool TryParseMediaType(string type, out Enums.MediaType mediaType)
        {
            return Enum.TryParse(type, true, out mediaType);
        }

        // Helper method to check if media item already exists in favorites
        private async Task<MediaItem?> GetExistingMediaItemAsync(string tmdbId, Enums.MediaType mediaType)
        {
            return await _context.MediaItem.FirstOrDefaultAsync(m => m.TmdbId == tmdbId && m.Type == mediaType);
        }


        //CRUD

        // Add to Favorites
        [HttpPost("user/{userId}/add"), Authorize]
        public async Task<IActionResult> AddToFavorites(string userId, [FromBody] AddFavoritesDto favoritesAddDto)
        {
            try
            {
                if (!TryParseMediaType(favoritesAddDto.MediaItem.Type, out var mediaType))
                    return BadRequest(new { message = "Invalid media type." });

                if (string.IsNullOrWhiteSpace(favoritesAddDto.MediaItem.TmdbId))
                    return BadRequest(new { message = "Provide tmdbId" });

                var existingFavorite = await _context.Favorites
                    .Include(f => f.MediaItem)
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.MediaItem.TmdbId == favoritesAddDto.MediaItem.TmdbId && f.MediaItem.Type == mediaType);

                if (existingFavorite is not null)
                    return BadRequest(new { message = "This movie/tv show is already in your favorites list." });



                //  create the MediaItem and assign the FavoriteId
                var mediaItem = await GetExistingMediaItemAsync(favoritesAddDto.MediaItem.TmdbId, mediaType)
                           ?? new MediaItem
                           {
                               Type = mediaType,
                               TmdbId = favoritesAddDto.MediaItem.TmdbId,
                               Title = favoritesAddDto.MediaItem.Title,
                               LastEpisodeDate = favoritesAddDto.MediaItem.LastEpisodeDate,
                               NextEpisodeDate = favoritesAddDto.MediaItem.NextEpisodeDate,
                           };

                // Ensure the MediaItem is saved before adding to Favorites
                if (mediaItem.Id == Guid.Empty)
                {
                    await _context.MediaItem.AddAsync(mediaItem);
                }

                var favorite = new Favorites
                {
                    UserId = userId,
                    MediaItemId = mediaItem.Id
                };

                await _context.Favorites.AddAsync(favorite);
                await _context.SaveChangesAsync();



                var currentDate = DateTime.UtcNow.Date;
                var tomorrow = currentDate.AddDays(1);
                var yesterday = currentDate.AddDays(-1);


                var notifications = new List<Notification>();

                if (mediaItem.LastEpisodeDate.HasValue &&
                    (mediaItem.LastEpisodeDate.Value.Date == yesterday || mediaItem.LastEpisodeDate.Value.Date == currentDate))
                {
                    var notification = new Notification
                    {
                        UserId = userId,
                        Message = $"The latest episode of {mediaItem.Title} was released on {mediaItem.LastEpisodeDate.Value.Date:yyyy-MM-dd}."

                    };
                    notifications.Add(notification);
                }

                if (mediaItem.NextEpisodeDate.HasValue &&
                    (mediaItem.NextEpisodeDate.Value.Date == tomorrow || mediaItem.NextEpisodeDate.Value.Date == currentDate))
                {
                    var notification = new Notification
                    {
                        UserId = userId,
                        Message = $"The latest episode of {mediaItem.Title} was released on {mediaItem.NextEpisodeDate.Value.Date:yyyy-MM-dd}."

                    };
                    notifications.Add(notification);
                }

                if (notifications.Any())
                {
                    await _context.Notification.AddRangeAsync(notifications);
                    await _context.SaveChangesAsync();
                }


                var result = new
                {
                    Id = favorite.Id,
                    UserId = favorite.UserId,
                    MediaItem = new
                    {
                        Id = mediaItem.Id,
                        Type = mediaItem.Type.ToString(),
                        TmdbId = mediaItem.TmdbId,
                        LastEpisodeDate = mediaItem.LastEpisodeDate,
                        NextEpisodeDate = mediaItem.NextEpisodeDate
                    }
                };

                return Ok(new { message = "Added to favorites successfully.", result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // Get Favorite by TMDB Id
        [HttpGet("user/{userId}/type/{type}/tmdb/{tmdbId}"), Authorize]
        public async Task<IActionResult> GetFavoriteByTmdbId(string userId, string tmdbId, string type)
        {
            try
            {

                if (!TryParseMediaType(type, out var mediaType))
                    return BadRequest(new { message = "Invalid media type." });

                var favorite = await _context.Favorites
                    .Where(f => f.UserId == userId && f.MediaItem.TmdbId == tmdbId && f.MediaItem.Type == mediaType)
                    .Select(f => new
                    {
                        f.Id,
                        f.UserId,
                        f.MediaItemId,
                        f.MediaItem.Type,
                        f.MediaItem.TmdbId,
                        f.MediaItem.LastEpisodeDate,
                        f.MediaItem.NextEpisodeDate,

                    })
                    .FirstOrDefaultAsync();

                if (favorite == null)
                    return NotFound(new { message = "Favorite movie/tv show does not exist." });


                var result = new
                {
                    Id = favorite.Id,
                    UserId = favorite.UserId,
                    MediaItem = new
                    {
                        Id = favorite.MediaItemId,
                        Type = favorite.Type.ToString(),
                        TmdbId = favorite.TmdbId,
                        LastEpisodeDate = favorite.LastEpisodeDate,
                        NextEpisodeDate = favorite.NextEpisodeDate
                    }
                };

                return Ok(new { message = "Favorite found", result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // Get all Favorites with Pagination
        [HttpGet("user/{id}"), Authorize]
        public async Task<IActionResult> GetFavorites(string id, string? mediaType, string? query, string? sortBy, int page = 1, int limit = 20)
        {
            try
            {
                var user = await GetUserByIdAsync(id);
                if (user == null) return NotFound(new { message = "User not found." });

                var favoritesQuery = _context.Favorites.Where(f => f.UserId == user.Id);

                if (!string.IsNullOrEmpty(mediaType))
                {
                    if (mediaType.ToLower() == "movie")
                        favoritesQuery = favoritesQuery.Where(f => f.MediaItem.Type == Enums.MediaType.Movie);
                    else if (mediaType.ToLower() == "tv")
                        favoritesQuery = favoritesQuery.Where(f => f.MediaItem.Type == Enums.MediaType.Tv);
                    else
                        return BadRequest(new { message = "Invalid media type." });
                }
                if (!string.IsNullOrEmpty(query))
                {

                    favoritesQuery = favoritesQuery.Where(f => f.MediaItem.Title.ToLower().Contains(query.ToLower()));
                }



                switch (sortBy?.ToLower())
                {
                    case "original":
                        favoritesQuery = favoritesQuery.OrderBy(f => f.MediaItem.AddedAt);
                        break;
                    case "addedAt_asc":
                        favoritesQuery = favoritesQuery.OrderBy(f => f.MediaItem.AddedAt);
                        break;
                    case "addedAt_desc":
                        favoritesQuery = favoritesQuery.OrderByDescending(f => f.MediaItem.AddedAt);
                        break;
                    case "title_az":
                        favoritesQuery = favoritesQuery.OrderBy(f => f.MediaItem.Title);
                        break;
                    case "title_za":
                        favoritesQuery = favoritesQuery.OrderByDescending(f => f.MediaItem.Title);
                        Console.WriteLine($"favoritesQuery: {favoritesQuery}");
                        break;
                    case "tv_first":
                        favoritesQuery = favoritesQuery.OrderByDescending(f => f.MediaItem.Type)
                            .ThenBy(f => f.MediaItem.Title);
                        break;
                    case "movie_first":
                        favoritesQuery = favoritesQuery.OrderBy(f => f.MediaItem.Type)
                            .ThenBy(f => f.MediaItem.Title);
                        break;

                    default:
                        favoritesQuery = favoritesQuery.OrderByDescending(f => f.MediaItem.AddedAt);
                        break;

                }

                var totalFavorites = await favoritesQuery.CountAsync();
                var totalPages = (int)Math.Ceiling(totalFavorites / (double)limit);

                var favorites = await favoritesQuery
                    .Select(f => new { f.Id, Type = f.MediaItem.Type.ToString().ToLower(), f.MediaItem.TmdbId, f.CreatedAt })
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .ToListAsync();

                return Ok(new { TotalFavorites = totalFavorites, Page = page, Limit = limit, TotalPages = totalPages, Favorites = favorites });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // Delete Favorite
        [HttpDelete("user/{userId}/type/{type}/tmdb/{tmdbId}/delete"), Authorize]
        public async Task<IActionResult> DeleteFavoriteById(string userId, string tmdbId, string type)
        {
            try
            {
                var user = await GetUserByIdAsync(userId);
                if (user == null) return NotFound(new { message = "User not found." });

                if (!TryParseMediaType(type, out var mediaType))
                    return BadRequest(new { message = "Invalid media type." });

                var favorite = await _context.Favorites
                    .FirstOrDefaultAsync(f => f.UserId == userId && f.MediaItem.TmdbId == tmdbId && f.MediaItem.Type == mediaType);

                if (favorite == null)
                    return NotFound(new { message = "Favorite does not exist." });

                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
