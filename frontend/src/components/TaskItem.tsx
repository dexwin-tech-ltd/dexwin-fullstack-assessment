interface Assignee {
  username: string;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  priority?: number | null;
  assignee?: Assignee | null;
}

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
}

const PRIORITY: Record<number, { label: string; cls: string }> = {
  1: { label: 'High', cls: 'high' },
  2: { label: 'Medium', cls: 'medium' },
  3: { label: 'Low', cls: 'low' },
};

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const done = task.status === 'DONE';
  const statusLabel = (task.status || '').replace(/_/g, ' ').toLowerCase();
  const priority = task.priority != null ? PRIORITY[task.priority] : undefined;

  return (
    <div className={'task-card' + (done ? ' done' : '')}>
      <div className="task-main">
        <span className="task-title">{task.title}</span>
        <div className="task-meta">
          <span className={'status-badge status-' + (task.status || '').toLowerCase()}>
            {statusLabel}
          </span>
          {task.priority != null && (
            <span className={'priority-pill' + (priority ? ' priority-' + priority.cls : '')}>
              {priority ? priority.label : 'P' + task.priority}
            </span>
          )}
          {task.assignee?.username && (
            <span className="assignee-chip">{task.assignee.username}</span>
          )}
        </div>
      </div>
      <button type="button" className="toggle-btn" onClick={() => onToggle(task)}>
        {done ? 'Reopen' : 'Complete'}
      </button>
    </div>
  );
}
