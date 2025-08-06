import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject, deleteProject, getProjects } from '../api';
import { useAuth } from '../contexts/AuthContext';
import '@/styles/dashboard.css';
import '@/styles/project.css';


interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks: any[];
}

const DashboardPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      loadProjects();
    }
  }, [token]);

  const loadProjects = async () => {
    try {
      const data = await getProjects(token!);
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      const project = await createProject(token!, { title: title.trim(), description: description.trim() });
      setProjects([project, ...projects]);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteProject(token!, id);
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Your Projects</h2>
        <button onClick={logout}>Logout</button>
      </header>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleCreate} className="project-form">
        <input
          type="text"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Project</button>
      </form>
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <div className="project-info" onClick={() => navigate(`/projects/${project.id}`)}>
              <h3>{project.title}</h3>
              {project.description && <p>{project.description}</p>}
              <small>Created {new Date(project.createdAt).toLocaleString()}</small>
            </div>
            <button className="delete-button" onClick={() => handleDelete(project.id)}>Delete</button>
          </li>
        ))}
        {projects.length === 0 && <p>No projects yet. Create one above.</p>}
      </ul>
    </div>
  );
};

export default DashboardPage;