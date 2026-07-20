import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../api/client';

interface ProjectListProps {
  selectedProjectId: number | null;
  onSelect: (id: number) => void;
}

export default function ProjectList({ selectedProjectId, onSelect }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  console.log(projects);
  

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
