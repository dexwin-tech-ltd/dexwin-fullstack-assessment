import { useEffect, useState } from 'react';
import { getProjects } from '../api/client';

export default function ProjectList({ selectedProjectId, onSelect }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      await getProjects().then(setProjects);
    };
    fetchProjects();
  }, []);

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
