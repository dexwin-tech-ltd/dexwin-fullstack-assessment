interface Task {
  id: number;
  name: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: 1 | 2 | 3 | null;
  assignee: { username: string } | null;
}

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
}

interface PriorityConfig {
  label: string;
  cls: string;
}

const PRIORITY: Record<1 | 2 | 3, PriorityConfig> = {
  1: { label: "High", cls: "high" },
  2: { label: "Medium", cls: "medium" },
  3: { label: "Low", cls: "low" },
};

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const done = task.status === "DONE";
  const statusLabel = (task.status || "").replace("_", " ").toLowerCase();
  const priority = task.priority ? PRIORITY[task.priority] : null;

  return (
    <div className="task-card">
      <div className={"task-content" + (done ? " done" : "")}>
        <span className="task-title">{task.name}</span>
        <div className="task-meta">
          <span
            className={
              "status-badge status-" + (task.status || "").toLowerCase()
            }
          >
            {statusLabel}
          </span>
          {task.priority != null && (
            <span
              className={
                "priority-pill" + (priority ? " priority-" + priority.cls : "")
              }
            >
              {priority ? priority.label : "P" + task.priority}
            </span>
          )}
          {task.assignee && (
            <span className="assignee-chip">{task.assignee.username}</span>
          )}
        </div>
      </div>
      <button className="toggle-btn" onClick={() => onToggle(task)}>
        {done ? "Reopen" : "Complete"}
      </button>
    </div>
  );
}
