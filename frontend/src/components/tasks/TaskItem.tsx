import React from 'react';
import '@/styles/task.css';


export interface TaskItemProps {
  id: number;
  title: string;
  dueDate?: string | null;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  dueDate,
  isCompleted,
  onToggle,
  onDelete,
  onEdit,
}) => (
  <div className="task-view">
    <input type="checkbox" checked={isCompleted} onChange={onToggle} />
    <span className={isCompleted ? 'completed' : ''}>{title}</span>
    {dueDate && (
      <small>Due {new Date(dueDate).toLocaleDateString()}</small>
    )}
    <div className="task-actions">

      <button onClick={onEdit} className="icon-button">
        <img src="/src/assets/icons/edit.jpg" alt="Edit" width={20} height={20} />
      </button>

      {/* <button onClick={onEdit}>Edit</button> */}


      <button onClick={onDelete} className="icon-button">
        <img src="/src/assets/icons/delete.jpg" alt="Delete" width={20} height={20} />
      </button>
      {/* <button className="delete-button" onClick={onDelete}>Delete</button> */}
    </div>
  </div>
);

export default TaskItem;
