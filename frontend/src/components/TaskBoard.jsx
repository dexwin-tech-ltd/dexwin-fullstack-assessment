import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client.js';
import TaskItem from './TaskItem.jsx';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTasks(projectId).then((data) => {
      setTasks(data);
    }).finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div>Loading...</div>;

  const handleToggle = (task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
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
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
