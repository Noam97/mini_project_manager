using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Data;
using MiniProjectManager.DTOs;
using MiniProjectManager.Models;

namespace MiniProjectManager.Services;

public class ProjectService : IProjectService
{
    private readonly ApplicationDbContext _context;

    public ProjectService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsAsync(int userId)
    {
        var projects = await _context.Projects
            .Where(p => p.UserId == userId)
            .Include(p => p.Tasks)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return projects.Select(p => new ProjectDto
        {
            Id = p.Id,
            Title = p.Title,
            Description = p.Description,
            CreatedAt = p.CreatedAt,
            Tasks = p.Tasks.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted
            }).ToList()
        });
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(int userId, int projectId)
    {
        var project = await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project == null)
            return null;

        return new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            Tasks = project.Tasks.Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                DueDate = t.DueDate,
                IsCompleted = t.IsCompleted
            }).ToList()
        };
    }

    public async Task<ProjectDto> CreateProjectAsync(int userId, ProjectCreateDto dto)
    {
        var project = new Project
        {
            Title = dto.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(dto.Description) ? null : dto.Description.Trim(),
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            Tasks = new List<TaskDto>()
        };
    }

    public async Task<bool> DeleteProjectAsync(int userId, int projectId)
    {
        var project = await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project == null)
            return false;

        _context.TaskItems.RemoveRange(project.Tasks);
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return true;
    }
}
