import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks(projectId).then((data) => {
      setTasks(data);
    });
  }, [projectId]);

  const handleToggle = (taskToUpdate) => {
    const next = taskToUpdate.status === 'DONE' ? 'TODO' : 'DONE';

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskToUpdate.id) {
        return {...task, status: next}
      }
      return task
    })
    setTasks(updatedTasks);
    updateTaskStatus(taskToUpdate.id, next);
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
