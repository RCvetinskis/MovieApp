using FavoriteMovieAppBackEnd.Data;
using FavoriteMovieAppBackEnd.Models;
using FavoriteMovieAppBackEnd.Models.DTOS;
using FavoriteMovieAppBackEnd.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    public AuthController(SignInManager<ApplicationUser> signInManager,
                          UserManager<ApplicationUser> userManager,
                          JwtSettings jwtSettings,
                          ApplicationDbContext context)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _jwtSettings = jwtSettings;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
    {
        if (!ValidateRegisterDto(registerDto))
            return BadRequest(new { message = "Invalid registration data." });

        try
        {
            var newUser = new ApplicationUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(newUser, registerDto.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = "Registration failed", errors = result.Errors });

            await AssignDefaultProfileImage(newUser);
            return Ok(new { message = "Registration successful." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
        var user = await _userManager.Users
        .Include(u => u.ProfileImage)
        .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized(new { message = "Unauthorized" });

        user.LastLogin = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var token = GenerateJwtToken(user);
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var userData = MapToUserResponseDto(user, baseUrl);
        return Ok(new
        {
            message = "Successfully signed in",
            auth_token = token,
            expires_at = DateTime.Now.AddDays(_jwtSettings.ExpiryDays),
            user = userData,
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
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    [HttpPost("checkuser")]
    [Authorize]
    public async Task<IActionResult> CheckUser()
    {
        try
        {
            var currentUser = await _userManager.GetUserAsync(HttpContext.User);
            if (currentUser != null)
                return Ok(new { message = "User is logged in", user = currentUser });

            return NotFound(new { message = "User not found." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal server error", error = ex.Message });
        }
    }

    private bool ValidateRegisterDto(RegisterDto registerDto)
    {
        return registerDto != null &&
               !string.IsNullOrWhiteSpace(registerDto.Email) &&
               !string.IsNullOrWhiteSpace(registerDto.UserName) &&
               !string.IsNullOrWhiteSpace(registerDto.Password);
    }

    private async Task AssignDefaultProfileImage(ApplicationUser newUser)
    {
        const string defaultImageFileName = "avatar.jpg";
        var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Images", "Profile");

        if (!Directory.Exists(uploadDirectory))
            Directory.CreateDirectory(uploadDirectory);

        var defaultImagePath = Path.Combine(uploadDirectory, defaultImageFileName);
        if (!System.IO.File.Exists(defaultImagePath))
            throw new FileNotFoundException("Default profile image not found.");

        var userProfileImageFileName = $"{newUser.Id}_profile.jpg";
        var userProfileImagePath = Path.Combine(uploadDirectory, userProfileImageFileName);

        System.IO.File.Copy(defaultImagePath, userProfileImagePath, overwrite: true);

        var profileImage = new ProfileImage
        {
            FileName = userProfileImageFileName,
            FilePath = $"/uploads/images/profile/{userProfileImageFileName}",
            UserId = newUser.Id
        };

        newUser.ProfileImage = profileImage;
        await _userManager.UpdateAsync(newUser);
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
}
