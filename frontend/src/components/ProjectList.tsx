import { useEffect, useState } from 'react';
import { getProjects } from '../api/client';

interface Project {
  id: number;
  name: string;
  description?: string;
}

interface ProjectListProps {
  selectedProjectId: number | null;
  onSelect: (id: number) => void;
}

export default function ProjectList({ selectedProjectId, onSelect }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    getProjects()
      .then((data) => {
        if (!ignore) setProjects(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!ignore) setError('Failed to load projects');
      });
    return () => {
      ignore = true;
    };
  }, []);

  if (error) return <div className="project-list error">{error}</div>;

  return (
    <div className="project-list">
      {projects.map((project) => (
        <button
          type="button"
          key={project.id}
          className={'project-item' + (project.id === selectedProjectId ? ' active' : '')}
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
