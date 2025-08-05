using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MiniProjectManager.Data;
using MiniProjectManager.DTOs;
using MiniProjectManager.Models;
using MiniProjectManager.Settings;

namespace MiniProjectManager.Services;

/// <summary>
/// Concrete implementation of authentication logic. Handles user registration,
/// password hashing and verification, and JWT generation.
/// </summary>
public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly JwtSettings _jwtSettings;

    public AuthService(ApplicationDbContext context, IOptions<JwtSettings> jwtOptions)
    {
        _context = context;
        _jwtSettings = jwtOptions.Value;
    }

    public async Task<string?> RegisterAsync(RegisterDto dto)
    {
        var normalizedUsername = dto.Username.Trim().ToLowerInvariant();
        // Check if user already exists
        var existingUser = _context.Users.SingleOrDefault(u => u.Username.ToLower() == normalizedUsername);
        if (existingUser != null)
        {
            return null;
        }

        using var hmac = new HMACSHA512();
        var user = new User
        {
            Username = dto.Username.Trim(),
            PasswordSalt = hmac.Key,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password))
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return GenerateToken(user);
    }

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var normalizedUsername = dto.Username.Trim().ToLowerInvariant();
        var user = _context.Users.SingleOrDefault(u => u.Username.ToLower() == normalizedUsername);
        if (user == null)
        {
            return null;
        }
        using var hmac = new HMACSHA512(user.PasswordSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
        if (!computedHash.SequenceEqual(user.PasswordHash))
        {
            return null;
        }

        return GenerateToken(user);
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };
        var token = new JwtSecurityToken(
            expires: DateTime.UtcNow.AddDays(1),
            claims: claims,
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}