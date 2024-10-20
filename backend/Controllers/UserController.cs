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
            {
                return NotFound(new { message = "User not found." });

            }
            return Ok(new { message = "User found", user = userInfo });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.Users.Include(u => u.ProfileImage)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }


            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var userData = new UserResponseDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
                LastLogin = user.LastLogin,
                ProfileImageUrl = user.ProfileImage != null
                ? $"{baseUrl}{user.ProfileImage.FilePath}"
                : null,
            };


            return Ok(new { message = "User found", user = userData });
        }

        [HttpPatch("{id}"), Authorize]

        public async Task<IActionResult> PatchUserById(string id, [FromForm] PatchUserDto model)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                //update username
                if (!string.IsNullOrWhiteSpace(model.UserName))
                {
                    var userNameExsists = await _userManager.FindByNameAsync
                        (model.UserName);
                    if (userNameExsists != null && userNameExsists.Id != user.Id)
                    {
                        return BadRequest(new { message = "Username is already taken" });
                    }
                    user.UserName = model.UserName;
                    user.UpdatedAt = DateTime.UtcNow;
                }
                //update password
                if (!string.IsNullOrWhiteSpace(model.Password))
                {
                    var result = await _userManager.ChangePasswordAsync
                        (user, model.CurrentPassword, model.Password);

                    if (!result.Succeeded)
                    {
                        return BadRequest
                            (new
                            {
                                message = "Failed to change password",
                                errors = result.Errors
                            });
                    }
                }


                var updateResult = await _userManager.UpdateAsync(user);

                if (!updateResult.Succeeded)
                {
                    return BadRequest(
                        new
                        {
                            message = "Failed to update user",
                            errors = updateResult.Errors
                        });
                }




                return Ok(new { message = "User updated successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500);
            }

        }


        [HttpPatch("{id}/profile-image"), Authorize]
        public async Task<IActionResult> UpdateProfileImage(string id, [FromForm] IFormFile newImage)
        {
            try
            {
                // Check if the provided file is valid
                if (newImage == null || newImage.Length == 0)
                {
                    return BadRequest(new { message = "No image provided" });
                }

                // Find the user in the database
                var user = await _context.Users
                    .Include(u => u.ProfileImage)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Setup upload directory path
                var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Images", "Profile");
                if (!Directory.Exists(uploadDirectory))
                {
                    Directory.CreateDirectory(uploadDirectory);
                }

                // Generate a new unique filename for the new image
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(newImage.FileName)}";
                var filePath = Path.Combine(uploadDirectory, fileName);

                // Delete the old image if it exists
                if (user.ProfileImage != null)
                {
                    var oldImagePath = Path.Combine(uploadDirectory, user.ProfileImage.FileName);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }

                    // Prepare the existing profile image for update
                    user.ProfileImage.FileName = fileName;
                    user.ProfileImage.FilePath = $"/uploads/images/profile/{fileName}";
                    user.ProfileImage.UploadedAt = DateTime.UtcNow;

                    // Save changes for the profile image update
                    _context.ProfileImage.Update(user.ProfileImage);
                }
                else
                {
                    // Create new profile image entry if it does not exist
                    var profileImage = new ProfileImage
                    {
                        FileName = fileName,
                        FilePath = $"/uploads/images/profile/{fileName}",
                        UploadedAt = DateTime.UtcNow,
                        UserId = user.Id
                    };

                    // Associate the new profile image with the user
                    user.ProfileImage = profileImage;

                    // Save the new profile image record to the database
                    await _context.ProfileImage.AddAsync(profileImage);
                }

                // Save the new image to the filesystem
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await newImage.CopyToAsync(stream);
                }

                // Update the user in Identity and save changes to the database
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return BadRequest(new { message = "Failed to update user", errors = updateResult.Errors });
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Profile image updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }


    }
}
