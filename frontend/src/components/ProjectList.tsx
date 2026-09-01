import { useEffect, useState } from 'react';
import { getProjects } from '../api/client';

type ProjectListProps = {
  selectedProjectId: string;
}

export default function ProjectList({ selectedProjectId, onSelect }) {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)

    getProjects().then(res => setProjects(res)).catch(err => setError(err))
    
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
