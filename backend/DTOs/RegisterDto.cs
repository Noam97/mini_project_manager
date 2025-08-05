using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs;

/// <summary>
/// Data transfer object for registering a new user. The password is not
/// persisted directly; instead it is hashed and salted by the AuthService.
/// </summary>
public class RegisterDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;
}