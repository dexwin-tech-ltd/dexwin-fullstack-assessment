import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPriorities, getTasks, updateTaskStatus } from '../api/client.js';
import { buildPriorityMap } from '../constants/taskPriorities.js';
import TaskItem from './TaskItem.jsx';

export default function TaskBoard({ projectId }) {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasks(projectId),
    enabled: !!projectId,
  });

  const { data: priorities = [] } = useQuery({
    queryKey: ['priorities'],
    queryFn: getPriorities,
    staleTime: Infinity,
  });

  const priorityMap = buildPriorityMap(priorities);

  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const handleToggle = (task) => {
    const next = task.status === 'DONE' ? 'TODO' : 'DONE';
    statusMutation.mutate({ taskId: task.id, status: next });
  };

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading tasks...</p>;
  }

  return (
    <div>
      <div className="board-header flex items-center gap-2.5 mb-4">
        <h2 className="m-0 text-xl font-semibold">Tasks</h2>
        <span className="task-count bg-gray-200 text-gray-700 rounded-full px-2.5 py-0.5 text-sm font-semibold">
          {tasks.length}
        </span>
      </div>
      <div className="task-list flex flex-col gap-2.5">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            priorityMap={priorityMap}
            onToggle={handleToggle}
            isLoading={statusMutation.isPending && statusMutation.variables?.taskId === task.id}
          />
        ))}
      </div>
    </div>
  );
}
