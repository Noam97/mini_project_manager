import React from 'react';

interface TaskFormProps {
  title: string;
  dueDate: string;
  onTitleChange: (val: string) => void;
  onDueDateChange: (val: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  dueDate,
  onTitleChange,
  onDueDateChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="task-form">
      <button type="button" className="close-btn" onClick={onCancel}>
        ×
      </button>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => onDueDateChange(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default TaskForm;
