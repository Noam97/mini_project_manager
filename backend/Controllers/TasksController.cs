using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.DTOs;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers;

[ApiController]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Route for creating a new task under a project
    [HttpPost("api/projects/{projectId}/tasks")]
    public async Task<IActionResult> CreateTask(int projectId, TaskCreateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();
        var task = await _taskService.CreateTaskAsync(userId, projectId, dto);
        if (task == null)
            return NotFound();

        var taskDto = new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted
        };

        return CreatedAtAction(nameof(CreateTask), new { projectId, id = task.Id }, taskDto);
    }

    // Route for updating an existing task
    [HttpPut("api/tasks/{taskId}")]
    public async Task<IActionResult> UpdateTask(int taskId, TaskUpdateDto dto)
    {
        var userId = GetUserId();
        var task = await _taskService.UpdateTaskAsync(userId, taskId, dto);
        if (task == null)
            return NotFound();

        var taskDto = new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted
        };

        return Ok(taskDto);
    }

    // Route for deleting an existing task
    [HttpDelete("api/tasks/{taskId}")]
    public async Task<IActionResult> DeleteTask(int taskId)
    {
        var userId = GetUserId();
        var deleted = await _taskService.DeleteTaskAsync(userId, taskId);
        if (!deleted)
            return NotFound();
        return NoContent();
    }
}
