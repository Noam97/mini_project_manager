export type SortOrder = 'asc' | 'desc';

export interface TaskItem {
  id: number;
  title: string;
  dueDate?: string | null;
  isCompleted: boolean;
  projectId: number;
}


export function sortTasksByDate(tasks: TaskItem[], order: SortOrder): TaskItem[] {
  return [...tasks].sort((a, b) => {
    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    return order === 'asc' ? aDate - bDate : bDate - aDate;
  });
}
