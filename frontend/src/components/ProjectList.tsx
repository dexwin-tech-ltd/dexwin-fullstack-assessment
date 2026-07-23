import { useEffect, useState } from 'react';
import { getProjects } from '../api/client';
import type { Project } from '../api/types';

interface ProjectListProps {
  selectedProjectId: number | null;
  onSelect: (id: number) => void;
}

export default function ProjectList({ selectedProjectId, onSelect }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load projects.'));
  }, []);

  if (error) {
    return <div className="project-list-error">{error}</div>;
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
