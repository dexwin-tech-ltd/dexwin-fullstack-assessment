- Location: TaskItem.tsx
- Status: observed
- Evidence: This JSX tag requires the module path 'react/jsx-runtime' to exist
- Impact: the frontend can fail to tpe check and sometimes compile
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: TaskTaskBoard.tsx
- Status: observed
- Evidence: This JSX tag requires the module path 'react/jsx-runtime' to exist
- Impact: the frontend can fail to tpe check and sometimes compile and statuses will not change
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: ProjectList.tsx
- Status: observed
- Evidence: This JSX tag requires the module path 'react/jsx-runtime' to exist
- Impact: it may fail to compile or render and users wont be able to select properties
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

//Backend

- Location: TaskController
- Status: observed
- Evidence: getTasks path
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

what I found: pagination parameters are being observed but not used in task listing endpoint

- Location: TaskController
- Status: observed
- Evidence: search(String query)
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:
  finding: sql query looks to be a string

1. observed that the statuses updates dontg show immediately in the ui and only show when i move to other tabs, or when i navigate
2. the task badges and status buttons can be seen but there is no visible actual tasks stated
3. no title of tasks as well, all are just listed with no titles
4. noticed the tasks are all the same in every page
