using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models;

/// <summary>
/// Represents an authenticated user of the system. A user can have many projects
/// and each project belongs to exactly one user.
/// </summary>
public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    // Store password hash and salt as byte arrays. For demonstration we roll
    // our own simple hashing in the AuthService. A production app should use
    // ASP.NET Core Identity or a proven library instead.
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

    public List<Project> Projects { get; set; } = new();
}