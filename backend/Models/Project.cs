using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models;

/// <summary>
/// Represents a project belonging to a specific user. A project can have
/// multiple tasks.
/// </summary>
public class Project
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to the owning user
    public int UserId { get; set; }
    public User? User { get; set; }
    
    public List<TaskItem> Tasks { get; set; } = new();
}