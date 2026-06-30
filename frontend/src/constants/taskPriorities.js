export const DEFAULT_PRIORITY_MAP = {
  HIGH: { label: 'High', cls: 'high' },
  MEDIUM: { label: 'Medium', cls: 'medium' },
  LOW: { label: 'Low', cls: 'low' },
};

export function buildPriorityMap(priorities) {
  if (!priorities?.length) {
    return DEFAULT_PRIORITY_MAP;
  }

  return priorities.reduce((map, priority) => {
    map[priority.value] = {
      label: priority.label,
      cls: priority.value.toLowerCase(),
    };
    return map;
  }, {});
}
