using FavoriteMovieAppBackEnd.Data;
using FavoriteMovieAppBackEnd.Models;
using FavoriteMovieAppBackEnd.Models.DTOS;
using FavoriteMovieAppBackEnd.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtSettings _jwtSettings;
    private readonly ApplicationDbContext _context;

    // Constructor injection for SignInManager and UserManager
    public AuthController(SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager, JwtSettings jwtSettings, ApplicationDbContext context)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _jwtSettings = jwtSettings;
        _context = context;
    }


    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
    {
        if (registerDto == null ||
            string.IsNullOrWhiteSpace(registerDto.Email) ||
            string.IsNullOrWhiteSpace(registerDto.UserName) ||
            string.IsNullOrWhiteSpace(registerDto.Password))
        {
            return BadRequest(new { message = "Invalid registration data." });
        }

        try
        {
            // Create the new user object
            var newUser = new ApplicationUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                CreatedAt = DateTime.UtcNow
            };

            //  Create the user using UserManager
            var result = await _userManager.CreateAsync(newUser, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Registration failed",
                    errors = result.Errors
                });
            }

            //  Generate the default profile image
            var defaultImageFileName = "avatar.jpg";
            var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Images", "Profile");

            // Check if upload directory exists, if not, create it
            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            var defaultImagePath = Path.Combine(uploadDirectory, defaultImageFileName);

            // Verify if the default image exists
            if (!System.IO.File.Exists(defaultImagePath))
            {
                return StatusCode(500, new { message = "Default profile image not found." });
            }

            // Generate a unique file name for the user's profile image
            var userProfileImageFileName = $"{newUser.Id}_profile.jpg";
            var userProfileImagePath = Path.Combine(uploadDirectory, userProfileImageFileName);

            // Step 4: Copy the default image to the user's profile image directory
            System.IO.File.Copy(defaultImagePath, userProfileImagePath, overwrite: true);

            // Step 5: Create the ProfileImage entity for the user
            var profileImage = new ProfileImage
            {
                FileName = userProfileImageFileName,
                FilePath = $"/uploads/images/profile/{userProfileImageFileName}",
                UserId = newUser.Id
            };

            //  Assign the profile image to the user and update the user entity
            newUser.ProfileImage = profileImage;

            // Since the user was already created, update the user entity with the profile image
            await _userManager.UpdateAsync(newUser);

            //  Return successful registration response
            return Ok(new { message = "Registration successful." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Internal server error",
                error = ex.Message
            });
        }
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.Now.AddDays(_jwtSettings.ExpiryDays),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized(new { message = "Unauthorized" });
        }

        user.LastLogin = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var token = GenerateJwtToken(user);
        return Ok(new
        {
            message = "Succesfully signed in",
            auth_token = token,
            expires_at = DateTime.Now.AddDays(_jwtSettings.ExpiryDays),
            userId = user.Id,
        });
    }



    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> LogoutUser()
    {
        try
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logout successful." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Internal server error",
                error = ex.Message
            });
        }
    }


    [HttpPost("checkuser")]
    [Authorize]
    public async Task<IActionResult> CheckUser()
    {
        try
        {
            var user = HttpContext.User;

            if (_signInManager.IsSignedIn(user))
            {
                var currentUser = await _userManager.GetUserAsync(user);
                if (currentUser != null)
                {
                    return Ok(new { message = "User is logged in", user = currentUser });
                }
                else
                {
                    return NotFound(new { message = "User not found." });
                }
            }
            else
            {
                return Forbid("Access Denied");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }
}
