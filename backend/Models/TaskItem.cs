using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models;

/// <summary>
/// Represents a task within a project. Each task belongs to a single project.
/// </summary>
public class TaskItem
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }

    public bool IsCompleted { get; set; } = false;

    // Foreign key to the parent project
    public int ProjectId { get; set; }
    public Project? Project { get; set; }
}