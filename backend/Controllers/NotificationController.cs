using FavoriteMovieAppBackEnd.Data;
using FavoriteMovieAppBackEnd.Lib;
using FavoriteMovieAppBackEnd.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;



namespace FavoriteMovieAppBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {

        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public NotificationController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }



        [HttpGet("user/{userId}/all"), Authorize]

        public async Task<IActionResult> GetUserNotifications(string userId, string? seen, int page = 1, int limit = 20)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return BadRequest(new { message = "User not found" });
                }

                var notificationQuery = _context.Notification.Where(n => n.UserId == userId);

                if (!String.IsNullOrEmpty(seen))
                {
                    if (seen == "true")
                    {
                        notificationQuery = notificationQuery.Where(n => n.IsSeen == true);
                    }
                    else if (seen == "false")
                    {
                        notificationQuery = notificationQuery.Where(n => n.IsSeen == false);
                    }

                }

                var totalNotifications = await notificationQuery.CountAsync();
                var totalPages = (int)Math.Ceiling(totalNotifications / (double)limit);

                var notifications = await notificationQuery
                    .Select(n => new { n.Id, n.Message, n.IsSeen, n.UserId, n.CreatedAt })
                    .Skip((page - 1) * limit)
                    .Take(limit)
                .ToListAsync();

                return Ok(new { totalNotifications, page, limit, totalPages, notifications });


            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPatch("mark-as-seen"), Authorize]

        public async Task<IActionResult> MarkAsSeen([FromBody] List<Guid> notificationIds)
        {
            try
            {
                if (notificationIds == null || !notificationIds.Any())
                {
                    return BadRequest("No notifications provided.");
                }

                var notifications = await _context.Notification
                      .Where(n => notificationIds.Contains(n.Id) && !n.IsSeen)
                      .ToListAsync();

                if (notifications == null || notifications.Count == 0)
                {
                    return NotFound("No notifications found.");
                }

                // Mark each notification as seen
                foreach (var notification in notifications)
                {
                    notification.IsSeen = true;
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                return Ok(new { message = "Notifications marked as seen." });

            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

    }
}
