const BASE_URL = 'http://localhost:5000';

export interface TaskCreateData {
  title: string;
  dueDate?: string | null;
}

export interface TaskUpdateData {
  title?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
}

export async function fetchProject(token: string, projectId: number) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to load project');
  return res.json();
}

export async function createTaskApi(
  token: string,
  projectId: number,
  data: TaskCreateData
) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTaskApi(
  token: string,
  taskId: number,
  data: TaskUpdateData
) {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTaskApi(token: string, taskId: number) {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete task');
}

export async function deleteProjectApi(token: string, projectId: number) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete project');
}
