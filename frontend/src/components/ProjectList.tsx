import { useEffect, useState } from 'react';
import { getProjects } from '../api/client';
import type { Project } from '../types';

interface ProjectListProps {
  selectedProjectId: number | null;
  onSelect: (id: number) => void;
}

export default function ProjectList({ selectedProjectId, onSelect }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = () => {
    setLoading(true);
    setError(null);
    getProjects()
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return <div className="empty-state">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="empty-state">
        <p>Error: {error}</p>
        <button className="toggle-btn" onClick={loadProjects}>Retry</button>
      </div>
    );
  }

  if (projects.length === 0) {
    return <div className="empty-state">No projects yet.</div>;
  }

  return (
    <div className="project-list">
      {projects.map((project) => (
        <button
          type="button"
          key={project.id}
          className={
            'project-item' + (project.id === selectedProjectId ? ' active' : '')
          }
          onClick={() => onSelect(project.id)}
        >
          <span className="project-name">{project.name}</span>
          {project.description && (
            <span className="project-desc">{project.description}</span>
          )}
        </button>
      ))}
    </div>
  );
}
