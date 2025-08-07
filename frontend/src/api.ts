const BASE_URL = import.meta.env.VITE_BASE_URL;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    if (error.errors && typeof error.errors === 'object') {
      const messages = Object.values(error.errors)
        .flat()
        .join(' ');
      throw new Error(messages);
    }

    const message = error.message || response.statusText;
    throw new Error(message);
  }

  return response.json();
}


export async function register(username: string, password: string, confirmPassword: string) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, confirmPassword, })
  });
  return handleResponse(res) as Promise<{ token: string }>;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(res) as Promise<{ token: string }>;
}

export async function getProjects(token: string) {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res) as Promise<any[]>;
}

export async function getProject(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return handleResponse(res);
}

export async function createProject(token: string, data: { title: string; description?: string }) {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function deleteProject(token: string, id: number) {
  const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  return true;
}

export async function createTask(token: string, projectId: number, data: { title: string; dueDate?: string | null }) {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function updateTask(token: string, taskId: number, data: { title?: string; dueDate?: string | null; isCompleted?: boolean }) {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

export async function deleteTask(token: string, taskId: number) {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || res.statusText);
  }
  return true;
}