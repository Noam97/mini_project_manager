using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs;

/// <summary>
/// DTO for creating a new project. Validation attributes ensure the title
/// length and optional description length meet business requirements.
/// </summary>
public class ProjectCreateDto
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
}