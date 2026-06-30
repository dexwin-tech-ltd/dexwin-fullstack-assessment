import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/client.js';

export default function ProjectList({ selectedProjectId, onSelect }) {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500 px-1">Loading projects...</p>;
  }

  return (
    <div className="project-list flex flex-col gap-2">
      {projects.map((project) => (
        <button
          type="button"
          key={project.id}
          className={
            'project-item w-full text-left flex flex-col gap-0.5 bg-white border border-gray-200 rounded-[10px] px-3.5 py-3 cursor-pointer transition-[border-color,box-shadow,background] duration-150 hover:border-indigo-200 hover:shadow-sm' +
            (project.id === selectedProjectId
              ? ' active bg-indigo-600 border-indigo-600 text-white'
              : '')
          }
          onClick={() => onSelect(project.id)}
        >
          <span className="project-name font-semibold text-sm">{project.name}</span>
          {project.description && (
            <span
              className={
                'project-desc text-xs text-gray-500' +
                (project.id === selectedProjectId ? ' text-indigo-200' : '')
              }
            >
              {project.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
