import { useEffect, useState } from "react";
import { getProjects } from "../api/client";

export default function ProjectList({ selectedProjectId, onSelect }) {
	const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
	useEffect(() => {
		getProjects()
			.then(setProjects)
			.catch(setError)
			.finally(() => setIsLoading(false));
	}, [projects]);

	return (
		<div className="project-list">
			{isLoading ? (
				<div className="loading">Loading projects...</div>
			) : error ? (
				<div className="error"> {error.message}</div>
			) : (
				projects.map((project) => (
					<button
						type="button"
						key={project.id}
						className={
							"project-item" +
							(project.id === selectedProjectId ? " active" : "")
						}
						onClick={() => onSelect(project.id)}
					>
						<span className="project-name">{project.name}</span>
						{project.description && (
							<span className="project-desc">{project.description}</span>
						)}
					</button>
				))
			)}
		</div>
	);
}
