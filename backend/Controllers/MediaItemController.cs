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
    public class MediaItemController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<MediaItemController> _logger;
        private readonly ApplicationDbContext _context;

        public MediaItemController(UserManager<ApplicationUser> userManager, ILogger<MediaItemController> logger, ApplicationDbContext context)
        {
            _userManager = userManager;
            _logger = logger;
            _context = context;
        }

        [HttpGet("user/{userId}/watchlist/{id}"), Authorize]

        public async Task<IActionResult>
            GetMediaItemsByWatchlistId(
            string? query,
            string? sortBy,
            string userId,
            string id,
            int page = 1,
            int limit = 20
            )
        {

            try
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {

                    return BadRequest(new { message = "User not found" });
                }

                if (!Guid.TryParse(id, out var watchlistId))
                {
                    return BadRequest(new { message = "Invalid watchlist ID format" });
                }

                var watchlist = await _context.Watchlist.Include(w => w.MediaItems).FirstOrDefaultAsync(w => w.Id == watchlistId);

                if (watchlist == null)
                {
                    return BadRequest(new { message = "Watchlist does not exist" });
                }


                var mediaItemsQuery = _context.MediaItem
                .Where(m => m.WatchlistId == watchlistId)
                .Select(m =>
                     new MediaItemDto
                     {
                         Title = m.Title,
                         TmdbId = m.TmdbId,
                         Type = m.Type.ToString(),
                         AddedAt = m.AddedAt
                     }
                );


                if (!string.IsNullOrWhiteSpace(query))
                {

                    mediaItemsQuery = mediaItemsQuery.Where(m => m.Title.Contains(query));
                }

                switch (sortBy?.ToLower())
                {
                    case "original":
                        mediaItemsQuery = mediaItemsQuery.OrderBy(m => m.AddedAt);
                        break;
                    case "addedAt_asc":
                        mediaItemsQuery = mediaItemsQuery.OrderBy(m => m.AddedAt);
                        break;
                    case "addedAt_desc":
                        mediaItemsQuery = mediaItemsQuery.OrderByDescending(m => m.AddedAt);
                        break;
                    case "title_az":
                        mediaItemsQuery = mediaItemsQuery.OrderBy(m => m.Title);
                        break;
                    case "title_za":
                        mediaItemsQuery = mediaItemsQuery.OrderByDescending(m => m.Title);
                        break;
                    case "tv_first":
                        mediaItemsQuery = mediaItemsQuery.OrderBy(m => m.Type == "tv" ? 0 : 1)
                            .ThenBy(m => m.Title);
                        break;
                    case "movie_first":
                        mediaItemsQuery = mediaItemsQuery.OrderBy(m => m.Type == "movie" ? 0 : 1)
                            .ThenBy(m => m.Title);
                        break;

                    default:
                        mediaItemsQuery = mediaItemsQuery.OrderByDescending(m => m.AddedAt);
                        break;

                }

                var totalItems = await mediaItemsQuery.CountAsync();
                var mediaItems = await mediaItemsQuery
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .ToListAsync();

                var totalPages = (int)Math.Ceiling(totalItems / (double)limit);

                var response = new
                {
                    page,
                    totalPages,
                    totalItems,
                    mediaItems
                };

                return Ok(new { message = "Successfully found mediaitems", response });

            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Error retrieving mediaitems");
                return StatusCode(500, new { message = "Internal server error" });
            }

        }

        [HttpPatch("user/{userId}/watchlist/{id}/addMediaItem"), Authorize]
        public async Task<IActionResult> AddMediaItemToWatchlist(string id, string userId, [FromBody] MediaItemDto mediaItemDto)
        {
            try
            {


                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {

                    return BadRequest(new { message = "User not found" });
                }
                if (!Guid.TryParse(id, out var watchlistId))
                {
                    return BadRequest(new { message = "Invalid watchlist ID format" });
                }


                var watchlist = await _context.Watchlist.Include(w => w.MediaItems).FirstOrDefaultAsync(w => w.Id == watchlistId);
                if (watchlist == null)
                {
                    return NotFound(new { message = "Watchlist not found." });
                }


                if (!Enum.TryParse<Enums.MediaType>(mediaItemDto.Type, true, out var mediaType))
                {
                    return BadRequest(new { message = $"Invalid media type: {mediaItemDto.Type}" });
                }

                // Check if the media item already exists in the watchlist to prevent duplicates
                var existingItem = watchlist.MediaItems
                    .FirstOrDefault(m => m.TmdbId == mediaItemDto.TmdbId && m.Type == mediaType);

                if (existingItem != null)
                {
                    return BadRequest(new { message = "Media item already exists in the watchlist." });
                }

                // Add the new media item to the watchlist
                var newMediaItem = new MediaItem
                {
                    TmdbId = mediaItemDto.TmdbId,
                    Type = mediaType,
                    Title = mediaItemDto.Title,
                    WatchlistId = watchlist.Id
                };

                watchlist.MediaItems.Add(newMediaItem);

                // Save changes
                await _context.SaveChangesAsync();

                return Ok(new { message = "Media item added to the watchlist." });
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                // _logger.LogError(ex, "An error occurred while adding the media item to the watchlist.");

                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }


}
