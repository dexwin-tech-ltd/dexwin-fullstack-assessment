import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

interface Task {
  id: number;
  name: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: 1 | 2 | 3 | null;
  assignee: { username: string } | null;
}

interface TaskBoardProps {
  projectId: number;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks(projectId).then((data: Task[]) => {
      setTasks(data);
    });
  }, [projectId]);

  const handleToggle = (task: Task): void => {
    const next: "TODO" | "DONE" = task.status === "DONE" ? "TODO" : "DONE";
    // Update local state properly - create new array and new task object
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    // Update on backend
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
