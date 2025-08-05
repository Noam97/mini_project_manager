using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs;

/// <summary>
/// DTO for updating an existing task. All fields are optional; only provided
/// properties will be updated.
/// </summary>
public class TaskUpdateDto
{
    public string? Title { get; set; }
    public DateTime? DueDate { get; set; }
    public bool? IsCompleted { get; set; }
}