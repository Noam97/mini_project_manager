import { useEffect, useState } from 'react';
import {
  fetchProject,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  deleteProjectApi
} from '../services/projectApi';

export interface TaskItem {
  id: number;
  title: string;
  dueDate?: string | null;
  isCompleted: boolean;
  projectId: number;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks: TaskItem[];
}

export function useProject(projectId: number, token: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchProject(token, projectId)
      .then((data) => setProject(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, projectId]);

  const createTask = async (data: { title: string; dueDate?: string | null }) => {
    if (!project) return;
    const task = await createTaskApi(token, project.id, data);
    setProject((prev) =>
      prev ? { ...prev, tasks: [...prev.tasks, task] } : prev
    );
  };

  const updateTask = async (
    taskId: number,
    data: { title?: string; dueDate?: string | null; isCompleted?: boolean }
  ) => {
    const updated = await updateTaskApi(token, taskId, data);
    setProject((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.map((t) => (t.id === taskId ? updated : t))
          }
        : prev
    );
  };

  const deleteTask = async (taskId: number) => {
    await deleteTaskApi(token, taskId);
    setProject((prev) =>
      prev
        ? {
            ...prev,
            tasks: prev.tasks.filter((t) => t.id !== taskId)
          }
        : prev
    );
  };

  const deleteProject = async () => {
    if (!project) return;
    await deleteProjectApi(token, project.id);
  };

  return {
    project,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    deleteProject
  };
}
