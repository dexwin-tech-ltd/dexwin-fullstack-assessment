import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setTasks([]);
    setUpdatingTaskId(null);

    getTasks(projectId)
      .then((data) => {
        if (isCurrentRequest) {
          setTasks(data);
        }
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [projectId]);

  const handleToggle = async (task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    setUpdatingTaskId(task.id);

    try {
      await updateTaskStatus(task.id, next);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? { ...currentTask, status: next } : currentTask
        )
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        {!isLoading && <span className="task-count">{tasks.length}</span>}
      </div>
      {isLoading ? (
        <div className="empty-state">Loading tasks...</div>
      ) : (
        <div className="task-list">
          {tasks.map((task, index) => (
            <TaskItem
              key={index}
              task={task}
              onToggle={handleToggle}
              isUpdating={updatingTaskId === task.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
