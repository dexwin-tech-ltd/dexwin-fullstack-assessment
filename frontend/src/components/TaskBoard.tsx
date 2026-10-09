import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../api/client";
import TaskItem from "./TaskItem";

export default function TaskBoard({ projectId }) {
	console.log("TaskBoard projectId:", projectId);
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		getTasks(projectId).then((data) => {
			console.log("Fetched tasks:", data);
			const filteredTasks = data.filter(
				(task) => task.project.id === Number(projectId),
			);
			setTasks(filteredTasks);
		});
	}, [projectId]);

	const handleToggle = (task) => {
		const next = task.status === "DONE" ? "TODO" : "DONE";
		task.status = next;
		setTasks(tasks);
		updateTaskStatus(task.id, next);
	};

	return (
		<div>
			<div className="board-header">
				<h2>Tasks</h2>
				<span className="task-count">{tasks.length}</span>
			</div>
			<div className="task-list">
				{tasks.map((task, index) => (
					<TaskItem key={index} task={task} onToggle={handleToggle} />
				))}
			</div>
		</div>
	);
}
