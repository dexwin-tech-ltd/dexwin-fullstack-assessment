import { useEffect, useState } from 'react';
import { getProjects } from '../api/client';

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ProjectListProps {
  selectedProjectId: string | null;
  onSelect: (projectId: string) => void;
}

export default function ProjectList({ selectedProjectId, onSelect }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let isMounted = true;

    getProjects().then((data) => {
      if (isMounted) {
        setProjects(Array.isArray(data) ? data : []);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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
          {project.description && <span className="project-desc">{project.description}</span>}
        </button>
      ))}
    </div>
  );
}
