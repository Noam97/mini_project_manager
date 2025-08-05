using MiniProjectManager.DTOs;

namespace MiniProjectManager.Services;

/// <summary>
/// Service for handling user registration and authentication.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Registers a new user and returns a JWT on success. If registration
    /// fails (e.g. username is taken) this returns null.
    /// </summary>
    Task<string?> RegisterAsync(RegisterDto dto);

    /// <summary>
    /// Validates a user's credentials and returns a JWT on success. If
    /// authentication fails this returns null.
    /// </summary>
    Task<string?> LoginAsync(LoginDto dto);
}