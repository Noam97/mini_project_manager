import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../hooks/useProject';
import TaskForm from '../components/tasks/TaskForm';
import TaskItem from '../components/tasks/TaskItem';
import { filterTasks, TaskStatusFilter } from '../utils/FilterUtils';
import { sortTasksByDate, SortOrder } from '../utils/SortUtils';
import '@/styles/project.css';
import "@/styles/task.css";
// import '../styles/error.css';


const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  const projectId = id ? parseInt(id, 10) : 0;
  const {
    project,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    deleteProject,
  } = useProject(projectId, token || '');

  const handleAddTask = async () => {
    await createTask({ title: taskTitle, dueDate: taskDueDate || null });
    setTaskTitle('');
    setTaskDueDate('');
    setShowTaskForm(false);
  };

  const displayedTasks = project
    ? sortTasksByDate(filterTasks(project.tasks, statusFilter), sortOrder)
    : [];

  const handleToggleCompletion = async (taskId: number, current: boolean) => {
    await updateTask(taskId, { isCompleted: !current });
  };

  const startEditing = (taskId: number, title: string, dueDate: string | null) => {
    setEditingTaskId(taskId);
    setEditTitle(title);
    setEditDueDate(dueDate ? dueDate.slice(0, 10) : '');
  };

  const handleSaveEdit = async (taskId: number) => {
    await updateTask(taskId, { title: editTitle, dueDate: editDueDate || null });
    setEditingTaskId(null);
    setEditTitle('');
    setEditDueDate('');
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    if (!window.confirm('Delete this project and all its tasks?')) return;
    await deleteProject();
    navigate('/');
  };

  return (
    <div className="project-details-container">
      <header className="project-header">
        <button onClick={() => navigate('/')}>{'←'} Back</button>
        <button className="delete-button" onClick={handleDeleteProject}>
          Delete Project
        </button>
      </header>

      {loading && <p>Loading project...</p>}
      {error && <p className="error">{error}</p>}
      {project && (
        <>
          <h2>{project.title}</h2>
          {project.description && <p>{project.description}</p>}

          <section className="task-section">
            <div
              className="task-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0 }}>Tasks</h3>
              {!showTaskForm && (
                <button className="add-task-button" onClick={() => setShowTaskForm(true)}>
                  + Add Task
                </button>
              )}
            </div>

            {showTaskForm && (
              <TaskForm
                title={taskTitle}
                dueDate={taskDueDate}
                onTitleChange={setTaskTitle}
                onDueDateChange={setTaskDueDate}
                onSubmit={handleAddTask}
                onCancel={() => {
                  setTaskTitle('');
                  setTaskDueDate('');
                  setShowTaskForm(false);
                }}
              />
            )}

            <div
              className="task-controls"
              style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}
            >
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
                      <button onClick={() => handleSaveEdit(task.id)}>Save</button>
                      <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <TaskItem
                      id={task.id}
                      title={task.title}
                      dueDate={task.dueDate}
                      isCompleted={task.isCompleted}
                      onToggle={() => handleToggleCompletion(task.id, task.isCompleted)}
                      onDelete={() => deleteTask(task.id)}
                      onEdit={() => startEditing(task.id, task.title, task.dueDate || null)}
                    />
                  )}
                </li>
              ))}
              {displayedTasks.length === 0 && <p>No tasks yet. Create one above.</p>}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
