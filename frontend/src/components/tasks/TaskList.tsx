import React from 'react';
import TaskItem, { TaskItemProps } from './TaskItem';

interface TaskListProps {
  tasks: TaskItemProps[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (!tasks.length) return <p>No tasks yet. Create one above.</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <TaskItem {...task} />
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
