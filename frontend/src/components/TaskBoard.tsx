import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem, { type TaskItemData } from './TaskItem';

interface TaskBoardProps {
  projectId: string;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<TaskItemData[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      const data = await getTasks(projectId);
      if (isMounted) {
        setTasks(Array.isArray(data) ? data : []);
      }
    };

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleToggle = async (task: TaskItemData) => {
    const nextStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    const previousStatus = task.status;

    setTasks((currentTasks) => currentTasks.map((item) => (item.id === task.id ? { ...item, status: nextStatus } : item)));

    try {
      await updateTaskStatus(task.id, nextStatus);
    } catch (error) {
      setTasks((currentTasks) => currentTasks.map((item) => (item.id === task.id ? { ...item, status: previousStatus } : item)));
    }
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
