namespace MiniProjectManager.Settings;

/// <summary>
/// Holds configuration for JWT authentication. The secret should be a long,
/// unpredictable string. For demonstration purposes we hardcode it in
/// Program.cs and bind it here via IOptions&lt;JwtSettings&gt;.
/// </summary>
public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
}