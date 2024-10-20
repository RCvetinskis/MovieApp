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
    public class LikesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<LikesController> _logger;

        public LikesController(
                 ApplicationDbContext context,
                 UserManager<ApplicationUser> userManager,
                ILogger<LikesController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }


        [HttpPost("post"), Authorize]
        public async Task<IActionResult> PostLike(PostLikeDislikeDto postLike)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(postLike.UserId))
                {
                    return BadRequest(new { message = "UserId is required" });
                }
                if (string.IsNullOrWhiteSpace(postLike.CommentId))
                {
                    return BadRequest(new { message = "CommentId is required" });
                }

                var user = await _userManager.FindByIdAsync(postLike.UserId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                if (!Guid.TryParse(postLike.CommentId, out var commentIdGuid))
                {
                    return BadRequest(new { message = "Invalid comment ID format" });
                }

                var comment = await _context.Comment.FirstOrDefaultAsync(c => c.Id == commentIdGuid);
                if (comment == null)
                {
                    return NotFound(new { message = "Comment does not exist" });
                }

                var alreadyDislikedComment = await _context.Dislikes.FirstOrDefaultAsync(d => d.CommentId == commentIdGuid && d.UserId == postLike.UserId);
                if (alreadyDislikedComment is not null)
                {
                    _context.Dislikes.Remove(alreadyDislikedComment);
                    await _context.SaveChangesAsync();
                }


                var alreadyLikedComment = await _context.Likes.FirstOrDefaultAsync(l => l.CommentId == commentIdGuid && l.UserId == postLike.UserId);

                if (alreadyLikedComment is not null)
                {

                    _context.Likes.Remove(alreadyLikedComment);
                    await _context.SaveChangesAsync();
                    return NoContent();
                }

                var newLike = new Likes
                {
                    UserId = postLike.UserId,
                    CommentId = commentIdGuid
                };

                await _context.Likes.AddAsync(newLike);
                await _context.SaveChangesAsync();


                if (newLike == null)
                {

                    return BadRequest(new { message = "Failed to like this comment" });
                }
                var totalLikes = await _context.Likes.CountAsync(l => l.CommentId == commentIdGuid);

                var result = new
                {
                    Id = newLike.Id,
                    UserId = newLike.UserId,
                    CommentId = newLike.CommentId,
                    CreatedAt = newLike.CreatedAt,
                    TotalLikes = totalLikes,

                };
                return Ok(new { message = "Successfully liked comment", result = result });



            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding or updating like");
                return StatusCode(500, new { message = "Internal server error" });
            }

        }


        [HttpGet("get/comment/{commentId}")]
        public async Task<IActionResult> getLikebyCommentId(string commentId)
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



                var like = await _context.Likes.FirstOrDefaultAsync(l => l.CommentId == commentIdGuid);

                if (like == null)
                {
                    return NotFound(new { message = "Like is not found" });
                }

                var totalLikes = await _context.Likes.CountAsync(l => l.CommentId == commentIdGuid);

                var result = new
                {

                    Id = like.Id,
                    CommentId = like.CommentId,
                    UserId = like.UserId,
                    CreatedAt = like.CreatedAt,
                    TotalLikes = totalLikes,


                };

                return Ok(new { message = "Succesfully found like", result = result });



            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting like by comment id");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
