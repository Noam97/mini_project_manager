using MiniProjectManager.DTOs;
using MiniProjectManager.Models;

namespace MiniProjectManager.Services;

/// <summary>
/// Service responsible for task CRUD operations within projects. Methods
/// ensure tasks belong to the requesting user.
/// </summary>
public interface ITaskService
{
    Task<TaskItem?> CreateTaskAsync(int userId, int projectId, TaskCreateDto dto);
    Task<TaskItem?> UpdateTaskAsync(int userId, int taskId, TaskUpdateDto dto);
    Task<bool> DeleteTaskAsync(int userId, int taskId);
}