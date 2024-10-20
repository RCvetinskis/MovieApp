using FavoriteMovieAppBackEnd.Data;
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
    public class DislikesController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<DislikesController> _logger;


        public DislikesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, ILogger<DislikesController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpPost("post"), Authorize]
        public async Task<IActionResult> PostDislike(PostLikeDislikeDto postDislike)
        {

            try
            {
                var user = await _userManager.FindByIdAsync(postDislike.UserId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (!Guid.TryParse(postDislike.CommentId, out var commentIdGuid))
                {
                    return BadRequest(new { message = "Invalid comment ID format" });
                }

                var comment = await _context.Comment.FirstOrDefaultAsync(c => c.Id == commentIdGuid);
                if (comment == null)
                {
                    return NotFound(new { message = "Comment does not exist" });
                }



                var alreadyLikedComment = await _context.Likes.FirstOrDefaultAsync(l => l.CommentId == commentIdGuid && l.UserId == postDislike.UserId);
                if (alreadyLikedComment is not null)
                {
                    _context.Likes.Remove(alreadyLikedComment);
                    await _context.SaveChangesAsync();

                }
                var alreadyDislikedComment = await _context.Dislikes.FirstOrDefaultAsync(d => d.CommentId == commentIdGuid && d.UserId == postDislike.UserId);
                if (alreadyDislikedComment is not null)
                {
                    _context.Dislikes.Remove(alreadyDislikedComment);
                    await _context.SaveChangesAsync();
                    return NoContent();
                }



                var newDislike = new Dislikes
                {
                    UserId = postDislike.UserId,
                    CommentId = commentIdGuid,

                };

                await _context.Dislikes.AddAsync(newDislike);
                await _context.SaveChangesAsync();
                var totalDislikes = await _context.Dislikes.CountAsync(d => d.CommentId == commentIdGuid);
                var result = new
                {
                    Id = newDislike.Id,
                    UserId = newDislike.UserId,
                    CommentId = newDislike.CommentId,
                    CreatedAt = newDislike.CreatedAt,
                    TotalDislikes = totalDislikes,

                };

                return Ok(new { message = "Succesfully disliked comment", result = result });



            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting like");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }


        [HttpGet("get/comment/{commentId}")]
        public async Task<IActionResult> GetDislikeByCommentId(string commentId)
        {

            try
            {
                if (!Guid.TryParse(commentId, out var commentIdGuid))
                {
                    return BadRequest(new { message = "Invalid comment ID format" });
                }

                var comment = await _context.Comment.FirstOrDefaultAsync(c => c.Id == commentIdGuid);
                if (comment == null)
                {
                    return NotFound(new { message = "Comment does not exist" });
                }

                var dislike = await _context.Dislikes.FirstOrDefaultAsync(d => d.CommentId == commentIdGuid);

                if (dislike == null)
                {
                    return NotFound(new { message = "Dislike not found" });
                }

                var totalDislikes = await _context.Dislikes.CountAsync(d => d.CommentId == commentIdGuid);

                var result = new
                {
                    Id = dislike.Id,
                    CommentId = dislike.CommentId,
                    UserId = dislike.UserId,
                    CreatedAt = dislike.CreatedAt,
                    TotalDislikes = totalDislikes,
                };
                return Ok(new { message = "Succesfully found dislike", result = result });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dislike by comment ID");
                return StatusCode(500, new { message = "INternal server error" });

            }
        }
    }
}
