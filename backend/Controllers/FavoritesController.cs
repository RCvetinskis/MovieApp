using FavoriteMovieAppBackEnd.Data;
using FavoriteMovieAppBackEnd.Lib;
using FavoriteMovieAppBackEnd.Models.DTOS;
using FavoriteMovieAppBackEnd.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        // Add to Favorites
        [HttpPost("user/{id}/add"), Authorize]
        public async Task<IActionResult> AddToFavorites(string id, [FromBody] AddFavoritesDto favoritesAddDto)
        {
            try
            {
                var user = await GetUserByIdAsync(id);
                if (user == null) return NotFound(new { message = "User not found." });

                if (!TryParseMediaType(favoritesAddDto.MediaItem.Type, out var mediaType))
                    return BadRequest(new { message = "Invalid media type." });

                if (string.IsNullOrWhiteSpace(favoritesAddDto.MediaItem.TmdbId))
                    return BadRequest(new { message = "Provide tmdbId" });

                var existingFavorite = await _context.Favorites
                    .Where(f => f.UserId == id)
                    .AnyAsync(f => f.MediaItem.TmdbId == favoritesAddDto.MediaItem.TmdbId && f.MediaItem.Type == mediaType);

                if (existingFavorite)
                    return BadRequest(new { message = "This movie/tv show is already in your favorites list." });

                var mediaItem = await GetExistingMediaItemAsync(favoritesAddDto.MediaItem.TmdbId, mediaType)
                    ?? new MediaItem
                    {
                        Type = mediaType,
                        TmdbId = favoritesAddDto.MediaItem.TmdbId,
                        LastEpisodeDate = favoritesAddDto.MediaItem.LastEpisodeDate,
                        NextEpisodeDate = favoritesAddDto.MediaItem.NextEpisodeDate
                    };

                if (mediaItem.Id == Guid.Empty)
                {
                    await _context.MediaItem.AddAsync(mediaItem);
                    await _context.SaveChangesAsync();
                }

                var favorite = new Favorites
                {
                    UserId = user.Id,
                    MediaItemId = mediaItem.Id
                };

                await _context.Favorites.AddAsync(favorite);
                await _context.SaveChangesAsync();


                var result = new
                {
                    Id = favorite.Id,
                    UserId = favorite.UserId,
                    MediaItem = new
                    {
                        Type = mediaItem.Type,
                        TmdbId = mediaItem.TmdbId,
                        LastEpisodeDate = mediaItem.LastEpisodeDate,
                        NextEpisodeDate = mediaItem.NextEpisodeDate
                    }
                };

                return Ok(new { message = "Added to favorites successfully.", result = result });
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
                var user = await GetUserByIdAsync(userId);
                if (user == null) return NotFound(new { message = "User not found." });

                if (!TryParseMediaType(type, out var mediaType))
                    return BadRequest(new { message = "Invalid media type." });

                var favorite = await _context.Favorites
                    .Where(f => f.UserId == userId && f.MediaItem.TmdbId == tmdbId && f.MediaItem.Type == mediaType)
                    .Select(f => new { f.MediaItem, f.Id, f.UserId })
                    .FirstOrDefaultAsync();

                if (favorite == null)
                    return NotFound(new { message = "Favorite movie/tv show does not exist." });


                return Ok(new { message = "Favorite found", favorite });
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

                var totalFavorites = await favoritesQuery.CountAsync();
                var totalPages = (int)Math.Ceiling(totalFavorites / (double)limit);

                var favorites = await favoritesQuery
                    .Select(f => new { f.Id, Type = f.MediaItem.Type.ToString(), f.MediaItem.TmdbId, f.CreatedAt })
                    .OrderBy(f => f.CreatedAt)
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
