export type TaskStatusFilter = 'all' | 'completed' | 'incomplete';

export interface TaskItem {
  id: number;
  title: string;
  dueDate?: string | null;
  isCompleted: boolean;
  projectId: number;
}


export function filterTasks(tasks: TaskItem[], status: TaskStatusFilter): TaskItem[] {
  if (status === 'completed') {
    return tasks.filter((t) => t.isCompleted);
  }
  if (status === 'incomplete') {
    return tasks.filter((t) => !t.isCompleted);
  }
  return tasks; // all
}
