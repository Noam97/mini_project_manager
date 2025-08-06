import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../hooks/useProject';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import { filterTasks, TaskStatusFilter } from '../utils/FilterUtils';
import { sortTasksByDate, SortOrder } from '../utils/SortUtils';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const projectId = id ? parseInt(id, 10) : 0;
  const { project, error, loading, createTask, updateTask, deleteTask, deleteProject } =
    useProject(projectId, token || '');

  const handleAddTask = async () => {
    await createTask({ title: taskTitle, dueDate: taskDueDate || null });
    setTaskTitle('');
    setTaskDueDate('');
    setShowTaskForm(false);
  };

  const displayedTasks = project
    ? sortTasksByDate(filterTasks(project.tasks, statusFilter), sortOrder)
    : [];

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
                marginBottom: '1rem'
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

            {/* controls for filter & sort */}
            <div className="task-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
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

            <TaskList
              tasks={displayedTasks.map((t) => ({
                id: t.id,
                title: t.title,
                dueDate: t.dueDate,
                isCompleted: t.isCompleted,
                onToggle: () => updateTask(t.id, { isCompleted: !t.isCompleted }),
                onEdit: () => {
                  // open edit mode (implementation left for brevity)
                },
                onDelete: () => deleteTask(t.id)
              }))}
              onToggle={(taskId) => updateTask(taskId, {})}
              onEdit={(taskId) => {
                /* implement editing if needed */
              }}
              onDelete={(taskId) => deleteTask(taskId)}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
