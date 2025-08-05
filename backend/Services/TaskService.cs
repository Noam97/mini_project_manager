using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Data;
using MiniProjectManager.DTOs;
using MiniProjectManager.Models;

namespace MiniProjectManager.Services;

/// <summary>
/// Implementation of task CRUD operations.
/// </summary>
public class TaskService : ITaskService
{
    private readonly ApplicationDbContext _context;

    public TaskService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TaskItem?> CreateTaskAsync(int userId, int projectId, TaskCreateDto dto)
    {
        // Ensure the project belongs to the user
        var project = await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        if (project == null)
        {
            return null;
        }
        var task = new TaskItem
        {
            Title = dto.Title.Trim(),
            DueDate = dto.DueDate,
            IsCompleted = false,
            ProjectId = projectId
        };
        _context.TaskItems.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem?> UpdateTaskAsync(int userId, int taskId, TaskUpdateDto dto)
    {
        var task = await _context.TaskItems
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId);
        if (task == null || task.Project == null || task.Project.UserId != userId)
        {
            return null;
        }
        if (dto.Title != null)
        {
            task.Title = dto.Title.Trim();
        }
        if (dto.DueDate.HasValue)
        {
            task.DueDate = dto.DueDate;
        }
        if (dto.IsCompleted.HasValue)
        {
            task.IsCompleted = dto.IsCompleted.Value;
        }
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<bool> DeleteTaskAsync(int userId, int taskId)
    {
        var task = await _context.TaskItems
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == taskId);
        if (task == null || task.Project == null || task.Project.UserId != userId)
        {
            return false;
        }
        _context.TaskItems.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }
}