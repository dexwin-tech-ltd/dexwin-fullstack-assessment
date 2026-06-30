export default function TaskItem({ task, priorityMap, onToggle, isLoading }) {
  const done = task.status === 'DONE';
  const statusLabel = (task.status || '').replace('_', ' ').toLowerCase();
  const priority = priorityMap[task.priority];

  return (
    <div
      className={
        'task-card bg-white border border-gray-200 border-l-4 border-l-slate-300 rounded-[10px] px-4 py-3.5 flex flex-wrap justify-between items-center gap-3 sm:gap-4 transition-shadow duration-150 hover:shadow-md' +
        (done ? ' done opacity-60' : '')
      }
    >
      <div className="task-main min-w-0 flex-1">
        <span className="task-title block font-semibold text-[15px] mb-2 break-words">
          {task.title}
        </span>
        <div className="task-meta flex flex-wrap gap-1.5 items-center">
          <span className={'status-badge status-' + (task.status || '').toLowerCase()}>
            {statusLabel}
          </span>
          {task.priority != null && (
            <span
              className={
                'priority-pill' + (priority ? ' priority-' + priority.cls : '')
              }
            >
              {priority ? priority.label : task.priority}
            </span>
          )}
          {task.assignee && (
            <span className="assignee-chip">{task.assignee.username}</span>
          )}
        </div>
      </div>
      <button
        className="toggle-btn shrink-0 border border-gray-300 bg-white text-gray-700 rounded-lg px-3.5 py-1.5 text-sm font-semibold cursor-pointer transition-[background,border-color,color] duration-150 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onToggle(task)}
        disabled={isLoading}
      >
        {isLoading ? '...' : done ? 'Reopen' : 'Complete'}
      </button>
    </div>
  );
}
