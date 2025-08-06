import React from 'react';
import TaskItem, { TaskItemProps } from './TaskItem';

interface TaskListProps {
  tasks: TaskItemProps[];
  onToggle: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onEdit,
  onDelete
}) => {
  if (!tasks.length) return <p>No tasks yet. Create one above.</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <TaskItem
            {...task}
            onToggle={() => onToggle(task.id)}
            onEdit={() => onEdit(task.id)}
            onDelete={() => onDelete(task.id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
