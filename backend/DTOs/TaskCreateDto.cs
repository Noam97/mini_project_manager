using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs;

/// <summary>
/// DTO for creating a new task within a project.
/// </summary>
public class TaskCreateDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }
}