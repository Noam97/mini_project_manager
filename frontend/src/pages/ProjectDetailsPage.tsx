import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { filterTasks, TaskStatusFilter } from '../utils/FilterUtils';
import { sortTasksByDate, SortOrder } from '../utils/SortUtils';

import {
  getProject,
  createTask,
  updateTask,
  deleteTask,
  deleteProject
} from '../api';
import { useAuth } from '../contexts/AuthContext';

interface TaskItem {
  id: number;
  title: string;
  dueDate?: string | null;
  isCompleted: boolean;
  projectId: number;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks: TaskItem[];
}

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    if (token && id) {
      loadProject();
    }
  }, [token, id]);

  const loadProject = async () => {
    try {
      const data = await getProject(token!, parseInt(id!));
      setProject(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setError('Task title is required');
      setShowTaskForm(false);
      return;
    }
    try {
      const newTask = await createTask(token!, project!.id, {
        title: taskTitle.trim(),
        dueDate: taskDueDate ? taskDueDate : null
      });
      setProject((prev) => prev && { ...prev, tasks: [...prev.tasks, newTask] });
      setTaskTitle('');
      setTaskDueDate('');
      setShowTaskForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleCompletion = async (task: TaskItem) => {
    try {
      const updated = await updateTask(token!, task.id, { isCompleted: !task.isCompleted });
      setProject((prev) =>
        prev && {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === task.id ? updated : t))
        }
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(token!, taskId);
      setProject((prev) =>
        prev && { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId) }
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEditing = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
  };

  const saveEdit = async (taskId: number) => {
    try {
      const updated = await updateTask(token!, taskId, {
        title: editTitle,
        dueDate: editDueDate || null
      });
      setProject((prev) =>
        prev && {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === taskId ? updated : t))
        }
      );
      setEditingTaskId(null);
      setEditTitle('');
      setEditDueDate('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await deleteProject(token!, project.id);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!project) {
    return <div className="project-details-container">{error ? <p className="error">{error}</p> : <p>Loading...</p>}</div>;
  }

  const displayedTasks = sortTasksByDate(
    filterTasks(project.tasks, statusFilter),
    sortOrder
  );

  return (
    <div className="project-details-container">
      <header className="project-header">
        <button onClick={() => navigate('/')}>{'←'} Back</button>
        <button className="delete-button" onClick={handleDeleteProject}>Delete Project</button>
      </header>
      <h2>{project.title}</h2>

      {project.description && <p>{project.description}</p>}
      {error && <p className="error">{error}</p>}

      <section className="task-section">
        <div
          className="task-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <h3 style={{ margin: 0 }}>Tasks</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label>
              Filter:
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatusFilter)}
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </label>
            <label>
              Sort:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              >
                <option value="asc">Earliest first</option>
                <option value="desc">Latest first</option>
              </select>
            </label>
          </div>
          {!showTaskForm ? (
            <button className="add-task-button" onClick={() => setShowTaskForm(true)}>
              + Add Task
            </button>
          ) : (
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
              />
              <button type="submit">Create</button>
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setShowTaskForm(false);
                  setTaskTitle('');
                  setTaskDueDate('');
                }}
              >
                ×
              </button>
            </form>
          )}
        </div>

        <ul className="task-list">
          {displayedTasks.map((task) => (
            <li key={task.id} className="task-item">
              {editingTaskId === task.id ? (
                <div className="task-editing">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>Save</button>
                  <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                </div>
              ) : (
                <div className="task-view">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleCompletion(task)}
                  />
                  <span className={task.isCompleted ? 'completed' : ''}>{task.title}</span>
                  {task.dueDate && (
                    <small>Due {new Date(task.dueDate).toLocaleDateString()}</small>
                  )}
                  <div className="task-actions">
                    <button onClick={() => startEditing(task)}>Edit</button>
                    <button className="delete-button" onClick={() => removeTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
          {displayedTasks.length === 0 && <p>No tasks yet. Create one above.</p>}
        </ul>
      </section>
    </div>
  );
};

export default ProjectDetailsPage;
