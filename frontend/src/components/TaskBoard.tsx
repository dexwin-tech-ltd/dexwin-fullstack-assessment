import { useEffect, useState } from "react";
import { getTasks, updateTaskStatus } from "../api/client";
import TaskItem from "./TaskItem";

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getTasks(projectId)
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error("Failed to load tasks:", err);
        setError(err.message);
      });
  }, [projectId]);

  const handleToggle = async (task) => {
    const next = task.status === "DONE" ? "TODO" : "DONE";

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? { ...t, status: next } : t)),
    );

    try {
      await updateTaskStatus(task.id, next);
    } catch (err) {
      // Revert the optimistic update if the server call fails
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, status: task.status } : t,
        ),
      );
    }
  };

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
