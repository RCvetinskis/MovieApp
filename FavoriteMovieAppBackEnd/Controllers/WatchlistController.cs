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
    public class WatchlistController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<WatchlistController> _logger;
        private readonly ApplicationDbContext _context;

        public WatchlistController(UserManager<ApplicationUser> userManager, ILogger<WatchlistController> logger, ApplicationDbContext context)
        {
            _userManager = userManager;
            _logger = logger;
            _context = context;
        }

        [HttpPost("user/{userId}/add"), Authorize]
        public async Task<IActionResult> AddWatchlist(string userId, [FromBody] AddWatchlistDto addWatchlistDto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                if (string.IsNullOrWhiteSpace(addWatchlistDto.Name))
                {
                    return BadRequest(new { message = "Name is required" });
                }

                var currentWatchlist = await _context.Watchlist
                    .FirstOrDefaultAsync(w => w.UserId == userId && w.Name == addWatchlistDto.Name);

                if (currentWatchlist != null)
                {
                    return BadRequest(new { message = "A watchlist with this name already exists" });
                }

                // Create the new watchlist
                var newWatchlist = new Watchlist
                {
                    UserId = userId,
                    Name = addWatchlistDto.Name,
                    Public = addWatchlistDto.Public,
                    Description = addWatchlistDto.Description,
                    ImageUrl = addWatchlistDto.ImageUrl
                };

                // Create MediaItems and link them to the new watchlist
                var mediaItems = addWatchlistDto.MediaItems.Select(miDto =>
                {
                    Enums.MediaType mediaType;

                    if (!Enum.TryParse<Enums.MediaType>(miDto.Type, true, out mediaType))
                    {
                        throw new ArgumentException($"Invalid media type: {miDto.Type}");
                    }

                    return new MediaItem
                    {
                        Title = miDto.Title,
                        TmdbId = miDto.TmdbId,
                        Type = mediaType,
                        WatchlistId = newWatchlist.Id
                    };
                }).ToList();


                newWatchlist.MediaItems = mediaItems;

                _context.Watchlist.Add(newWatchlist);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Watchlist added successfully", watchlistId = newWatchlist.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding watchlist");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPatch("user/{userId}/edit/{id}"), Authorize]
        public async Task<IActionResult> EditWatchlist(string userId, string id, [FromBody] EditWatchlistDto editWatchlistDto)
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


                var exisintgWatchlist = await _context.Watchlist
                    .Include(w => w.MediaItems)
                    .FirstOrDefaultAsync(w => w.UserId == userId && w.Id == watchlistId);

                if (exisintgWatchlist == null)
                {
                    return NotFound(new { message = "Watchlist not found" });
                }

                if (!string.IsNullOrWhiteSpace(editWatchlistDto.Name))
                {
                    exisintgWatchlist.Name = editWatchlistDto.Name;
                }


                if (editWatchlistDto.Public.HasValue)
                {
                    exisintgWatchlist.Public = editWatchlistDto.Public.Value;
                }

                if (!string.IsNullOrWhiteSpace(editWatchlistDto.Description))
                {
                    exisintgWatchlist.Description = editWatchlistDto.Description;
                }

                if (!string.IsNullOrWhiteSpace(editWatchlistDto.ImageUrl))
                {
                    exisintgWatchlist.ImageUrl = editWatchlistDto.ImageUrl;
                }
                if (editWatchlistDto.MediaItems != null && editWatchlistDto.MediaItems.Any())
                {

                    // Find media items to remove (items that exist in the watchlist but are not in the new list)
                    var mediaItemsToRemove = exisintgWatchlist.MediaItems
                        .Where(existingItem => !editWatchlistDto.MediaItems.Any(miDto => miDto.TmdbId == existingItem.TmdbId))
                        .ToList();

                    // Remove media items that no longer exist in the updated list
                    foreach (var mediaItemToRemove in mediaItemsToRemove)
                    {
                        exisintgWatchlist.MediaItems.Remove(mediaItemToRemove);
                    }

                    // Find media items to add (items that are in the new list but not in the existing watchlist)
                    var mediaItemsToAdd = editWatchlistDto.MediaItems
                        .Where(miDto => !exisintgWatchlist.MediaItems.Any(existingItem => existingItem.TmdbId == miDto.TmdbId))
                        .Select(miDto =>
                        {
                            Enums.MediaType mediaType;

                            // Try to parse the string to an enum
                            if (!Enum.TryParse<Enums.MediaType>(miDto.Type, true, out mediaType))
                            {

                                throw new ArgumentException($"Invalid media type: {miDto.Type}");
                            }

                            return new MediaItem
                            {
                                TmdbId = miDto.TmdbId,
                                Type = mediaType,
                                Title = miDto.Title,
                                WatchlistId = exisintgWatchlist.Id
                            };
                        }).ToList();


                    // Add the new media items
                    foreach (var mediaItemToAdd in mediaItemsToAdd)
                    {
                        exisintgWatchlist.MediaItems.Add(mediaItemToAdd);
                    }

                }

                _context.Watchlist.Update(exisintgWatchlist);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Watchlist updated successfully", watchlistId = exisintgWatchlist.Id });


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding watchlist");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }


        [HttpGet("user/{userId}/get/{id}"), Authorize]
        public async Task<IActionResult> GetWatchlistById(string userId, string id)
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



                var watchlist = await _context.Watchlist
                    .Where(w => w.Id == watchlistId && w.UserId == userId)
                    .Select(w => new
                    {
                        w.Id,
                        w.Name,
                        w.Public,
                        w.Description,
                        w.ImageUrl,
                        w.CreatedAt,

                    })
                    .FirstOrDefaultAsync();

                if (watchlist == null)
                {
                    return NotFound(new { message = "Watchlist not found" });
                }

                return Ok(new { message = "Watchlist retrieved successfully", watchlist });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving watchlist");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}/get/all"), Authorize]
        public async Task<IActionResult>
            GetAllWatchlistsByUser(string? query, string userId, int page = 1, int limit = 20)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);

                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                var watchlistsQuery = _context.Watchlist.Where(w => w.UserId == userId);

                if (!string.IsNullOrWhiteSpace(query))
                {
                    watchlistsQuery = watchlistsQuery.Where(w => w.Name.Contains(query));
                }

                var totalWatchlists = await watchlistsQuery.CountAsync();

                if (totalWatchlists == 0)
                {
                    return NotFound(new { message = "No watchlists found" });
                }

                var totalPages = (int)Math.Ceiling(totalWatchlists / (double)limit);

                var watchlists = await watchlistsQuery
                    .OrderBy(w => w.CreatedAt)
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .Select(w => new
                    {
                        w.Id,
                        w.Name,
                        w.Public,
                        w.Description,
                        w.ImageUrl,
                        w.CreatedAt,
                        MediaItemsTotal = w.MediaItems.Count,
                    })
                    .ToListAsync();



                return Ok(new
                {
                    message = "Watchlists retrieved successfully",
                    watchlists,
                    totalPages,
                    page,
                    limit,
                    totalWatchlists
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving watchlists");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }


        [HttpDelete("user/{userId}/delete/{id}"), Authorize]
        public async Task<IActionResult> DeleteWatchlistById(string userId, string id)
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

                var watchlist = await _context.Watchlist.FindAsync(watchlistId);

                if (watchlist == null)
                {
                    return NotFound(new { message = "Watchlist not found" });
                }

                _context.Watchlist.Remove(watchlist);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting watchlist");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
