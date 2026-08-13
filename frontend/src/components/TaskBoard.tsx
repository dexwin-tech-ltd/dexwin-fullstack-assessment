import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [error,setError] = useState("");

  useEffect(() => {
    getTasks(projectId).then((data) => {
      setTasks(data);
    });
  }, [projectId]);

  const handleToggle = async (task) => {
  const previous = task.status;
  const next = previous === 'DONE' ? 'TODO' : 'DONE';
  setError(null);
  setTasks((current) =>
    current.map((item) => (item.id === task.id ? { ...item, status: next } : item))
  );
  try {
    await updateTaskStatus(task.id, next);
  } catch (err) {
    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, status: previous } : item
      )
    );
    setError(err.message || 'Could not update task status.');
  }
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
