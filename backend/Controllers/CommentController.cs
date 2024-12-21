using FavoriteMovieAppBackEnd.Data;
using FavoriteMovieAppBackEnd.Models.DTOS;
using FavoriteMovieAppBackEnd.Models.Entities;
using FavoriteMovieAppBackEnd.WebSockets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FavoriteMovieAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<CommentController> _logger;
        private readonly CommentWebSocket _commentWebSocket;


        public CommentController
            (ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<CommentController> logger
            ,
            CommentWebSocket commentWebSocket)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
            _commentWebSocket = commentWebSocket;
        }

        [HttpPost("user/{userId}/post/{postId}/create"), Authorize]
        public async Task<IActionResult> CreateComment(string userId, string postId, PostCommentDto postCommentDto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                if (String.IsNullOrWhiteSpace(postId))
                {
                    return BadRequest(new { message = "Post id is required." });
                }

                var newComment = new Comment
                {
                    PostId = postId,
                    UserId = userId,
                    Message = postCommentDto.Message,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Comment.Add(newComment);
                await _context.SaveChangesAsync(); // Save comment to the database

                // Create DTO for broadcasting
                var commentDto = new CommentDto
                {
                    Id = newComment.Id,
                    Message = newComment.Message,
                    UserId = newComment.UserId,
                    PostId = newComment.PostId,
                    CreatedAt = newComment.CreatedAt
                };

                // Broadcast the comment to all connected users
                _commentWebSocket.BroadcastToAllClients(commentDto);


                return Ok(new { message = "Comment added successfully", commentId = newComment.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding or updating comment");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }


        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetAllCommentsByPostId(string postId, int page = 1, int limit = 20)
        {
            try
            {
                // Query the comments by postId
                var query = _context.Comment.Where(c => c.PostId == postId);

                // Get total count of comments
                var totalComments = await query.CountAsync();

                // Fetch the paginated comments
                var comments = await query
                    .OrderByDescending(c => c.CreatedAt)
                    .Skip((page - 1) * limit)
                    .Take(limit)
                    .ToListAsync();

                // Map comments to CommentDto
                var commentDtos = comments.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Message = c.Message,
                    UserId = c.UserId,
                    PostId = c.PostId,
                    CreatedAt = c.CreatedAt,
                    ReplyCount = _context.Comment.Count(r => r.ParentCommentId == c.Id)
                }).ToList();

                var totalPages = (int)Math.Ceiling(totalComments / (double)limit);



                var response = new
                {
                    Page = page,
                    TotalPages = totalPages,
                    Limit = limit,
                    TotalComments = totalComments,
                    Comments = commentDtos
                };

                return Ok(new { message = "Successfully found comments", response = response });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting comments by post id");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("user/{userId}/comment/{commentId}/reply"), Authorize]
        public async Task<IActionResult> ReplyToComment(string commentId, string userId, ReplyCommentDto replyCommentDto)
        {

            try
            {

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                if (!Guid.TryParse(commentId, out var commentIdString))
                {
                    return BadRequest(new { message = "Invalid watchlist ID format" });
                }

                var parentComment = await _context.Comment.FirstOrDefaultAsync(c => c.Id == commentIdString);

                if (parentComment == null)
                {
                    return BadRequest(new { message = "Comment does not exists" });
                }

                var newReply = new Comment
                {
                    UserId = user.Id,
                    ParentCommentId = parentComment.Id,
                    Message = replyCommentDto.Message,
                    PostId = parentComment.Id.ToString(),
                };

                _context.Comment.Add(newReply);
                await _context.SaveChangesAsync();

                // Create DTO for broadcasting
                var commentDto = new CommentDto
                {
                    Id = newReply.Id,
                    Message = newReply.Message,
                    UserId = newReply.UserId,
                    PostId = newReply.PostId,
                    CreatedAt = newReply.CreatedAt,
                    ParentCommentId = parentComment.Id,
                };

                // Broadcast the comment to all connected users
                _commentWebSocket.BroadcastToAllClients(commentDto);


                return Ok(new { message = "Reply posted successfully", replyId = newReply.Id });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting reply comment");
                return StatusCode(500, new { message = "Internal server error" });

            }
        }

        [HttpGet("comment/{commentId}/replies")]

        public async Task<IActionResult> GetRepliesByParentId(string commentId, int page = 1, int limit = 20)
        {
            try
            {
                if (!Guid.TryParse(commentId, out var commentIdString))
                {
                    return BadRequest(new { message = "Invalid watchlist ID format" });
                }

                var parentComment = await _context.Comment.FirstOrDefaultAsync(c => c.Id == commentIdString);

                if (parentComment == null)
                {
                    return BadRequest(new { message = "Comment does not exists" });
                }

                var query = _context.Comment.Where(c => c.ParentCommentId == parentComment.Id);

                var totalReplies = await query.CountAsync();

                var replies = await query
                .OrderByDescending(c => c.CreatedAt)
               .Skip((page - 1) * limit)
               .Take(limit)
                .ToListAsync();

                var commentDtos = replies.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Message = c.Message,
                    UserId = c.UserId,
                    PostId = c.PostId,
                    CreatedAt = c.CreatedAt,
                    ReplyCount = _context.Comment.Count(r => r.ParentCommentId == c.Id)
                }).ToList();


                var totalPages = (int)Math.Ceiling(totalReplies / (double)limit);


                var response = new
                {
                    Page = page,
                    TotalPages = totalPages,
                    Limit = limit,
                    TotalComments = totalReplies,
                    Comments = commentDtos
                };

                return Ok(new { message = "Successfully found replies", response = response });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetRepliesByParentId");
                return StatusCode(500, new { message = "Internal server error" });

            }

        }


    }
}
