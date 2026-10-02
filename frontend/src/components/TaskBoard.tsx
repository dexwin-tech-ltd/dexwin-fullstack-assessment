import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';
import {Task} from './TaskItem';
import { useQuery } from '@tanstack/react-query';

export default function TaskBoard({ projectId }: {projectId: number}) {
  const [tasks, setTasks] = useState([]);
  let [changed, setChanged] = useState(false)

  const fetchTasksForProject = () => {
    getTasks(projectId).then((data) => {
      setTasks(data);
    });
  }

  useEffect(() => {
    fetchTasksForProject()
  }, [projectId, ]);

  const handleToggle = (task: Task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    task.status = next;
    setTasks(tasks);
    updateTaskStatus(task.id, next);

    fetchTasksForProject();
    if (setChanged) setChanged(true)
    else setChanged(false)
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
