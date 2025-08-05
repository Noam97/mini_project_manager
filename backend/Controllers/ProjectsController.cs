using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.DTOs;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers;

/// <summary>
/// Handles CRUD operations for projects. Requires authentication.
/// </summary>
[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET: api/projects
    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var userId = GetUserId();
        var projects = await _projectService.GetProjectsAsync(userId);
        return Ok(projects);
    }

    // GET: api/projects/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProjectById(int id)
    {
        var userId = GetUserId();
        var project = await _projectService.GetProjectByIdAsync(userId, id);
        if (project == null)
            return NotFound();
        return Ok(project);
    }

    // POST: api/projects
    [HttpPost]
    public async Task<IActionResult> CreateProject(ProjectCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var project = await _projectService.CreateProjectAsync(userId, dto);
        return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, project);
    }

    // DELETE: api/projects/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var userId = GetUserId();
        var deleted = await _projectService.DeleteProjectAsync(userId, id);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
