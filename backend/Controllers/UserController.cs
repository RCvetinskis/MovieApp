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
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public UserController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("email/{email}"), Authorize]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var userInfo = await _userManager.FindByEmailAsync(email);
            if (userInfo == null)
                return NotFound(new { message = "User not found." });

            return Ok(new { message = "User found", user = userInfo });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.Users.Include(u => u.ProfileImage)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var userData = MapToUserResponseDto(user, baseUrl);

            return Ok(new { message = "User found", user = userData });
        }

        [HttpPatch("{id}"), Authorize]
        public async Task<IActionResult> PatchUserById(string id, [FromForm] PatchUserDto model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            var updateResult = await UpdateUserDetails(user, model);
            if (!updateResult.Succeeded)
                return BadRequest(new { message = "Failed to update user", errors = updateResult.Errors });

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var userData = MapToUserResponseDto(user, baseUrl);

            return Ok(new { message = "User updated successfully", result = userData });
        }

        [HttpPatch("{id}/profile-image"), Authorize]
        public async Task<IActionResult> UpdateProfileImage(string id, [FromForm] IFormFile newImage)
        {
            if (newImage == null || newImage.Length == 0)
                return BadRequest(new { message = "No image provided" });

            var user = await _context.Users.Include(u => u.ProfileImage)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Images", "Profile");
            Directory.CreateDirectory(uploadDirectory);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(newImage.FileName)}";
            var filePath = Path.Combine(uploadDirectory, fileName);

            UpdateProfileImageDetails(user, fileName, filePath);

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                return BadRequest(new { message = "Failed to update user", errors = updateResult.Errors });

            await _context.SaveChangesAsync();

            await SaveImageToFileSystem(filePath, newImage);

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var userData = MapToUserResponseDto(user, baseUrl);

            return Ok(new { message = "Profile image updated successfully", result = userData });
        }

        // Helper methods
        private UserResponseDto MapToUserResponseDto(ApplicationUser user, string baseUrl)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                LastLogin = user.LastLogin,
                ProfileImageUrl = user.ProfileImage != null ? $"{baseUrl}{user.ProfileImage.FilePath}" : null
            };
        }

        private async Task<IdentityResult> UpdateUserDetails(ApplicationUser user, PatchUserDto model)
        {
            if (!string.IsNullOrWhiteSpace(model.UserName))
            {
                var existingUser = await _userManager.FindByNameAsync(model.UserName);
                if (existingUser != null && existingUser.Id != user.Id)
                    return IdentityResult.Failed(new IdentityError { Description = "Username is already taken" });

                user.UserName = model.UserName;
                user.UpdatedAt = DateTime.UtcNow;
            }

            if (!string.IsNullOrWhiteSpace(model.Password))
            {
                var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.Password);
                if (!result.Succeeded)
                    return result;
            }

            return await _userManager.UpdateAsync(user);
        }

        private void UpdateProfileImageDetails(ApplicationUser user, string fileName, string filePath)
        {
            if (user.ProfileImage != null)
            {
                var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Images", "Profile", user.ProfileImage.FileName);
                if (System.IO.File.Exists(oldImagePath))
                    System.IO.File.Delete(oldImagePath);

                user.ProfileImage.FileName = fileName;
                user.ProfileImage.FilePath = $"/uploads/images/profile/{fileName}";
                user.ProfileImage.UploadedAt = DateTime.UtcNow;
                _context.ProfileImage.Update(user.ProfileImage);
            }
            else
            {
                var profileImage = new ProfileImage
                {
                    FileName = fileName,
                    FilePath = $"/uploads/images/profile/{fileName}",
                    UploadedAt = DateTime.UtcNow,
                    UserId = user.Id
                };

                user.ProfileImage = profileImage;
                _context.ProfileImage.Add(profileImage);
            }
        }

        private async Task SaveImageToFileSystem(string filePath, IFormFile newImage)
        {
            await using var stream = new FileStream(filePath, FileMode.Create);
            await newImage.CopyToAsync(stream);
        }
    }
}
