using MiniProjectManager.DTOs;
using MiniProjectManager.Models;

namespace MiniProjectManager.Services;

/// <summary>
/// Service responsible for project CRUD operations. All methods ensure that
/// actions are scoped to the authenticated user.
/// </summary>
public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetProjectsAsync(int userId);
    Task<ProjectDto?> GetProjectByIdAsync(int userId, int projectId);
    Task<ProjectDto> CreateProjectAsync(int userId, ProjectCreateDto dto);
    Task<bool> DeleteProjectAsync(int userId, int projectId);
}
