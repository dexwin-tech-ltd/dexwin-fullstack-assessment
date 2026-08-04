import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import CreateTaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);

  const loadTasks = () => {
    if (!projectId) return;
    getTasks(projectId).then((data) => {
      setTasks(data);
    });
  };

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  const handleToggle = (task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    setTasks((current) =>
      current.map((item) => (item.id === task.id ? { ...item, status: next } : item))
    );
    updateTaskStatus(task.id, next);
  };

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <CreateTaskForm projectId={projectId} onCreated={() => loadTasks()} />
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
