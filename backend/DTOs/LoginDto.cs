using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs;

/// <summary>
/// Data transfer object for logging an existing user in. The credentials are
/// validated by the AuthService.
/// </summary>
public class LoginDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}