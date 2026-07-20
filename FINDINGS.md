- Location: Projectlist.tsx
- Status: observed
- Evidence: there is no typescript interface defined for the props the component is receiving
- Impact:
- Priority: medium
- Proposed solution: Add an typescript interface for the props the component is receiving
- Verification:
- Implementation notes:

- Location: TaskBoard.tsx
- status: observed
- Evidence: Missing typescript interface for the props
- Impact:
- Priority: medium
- Proposed solution: Add an typescript interface for the props the component is receiving
- Verification:
- Implementation notes:

Backend:
location: AuthController.java
status: observed
Evidence: there is no validation checks in controller.

- Impact: Could cause cyber attacks and data issues
- Priority: high
- Proposed solution: instructed IDE AI to add validation checks on the data received
- Verification:
- Implementation notes:

Project Run Inspection:

- Clicking on a project button did not always refresh the task board content when the selection changed because the board was only fetching tasks on first mount.
- UI did not update when a task status changed because the component was mutating the existing task object and reusing stale state instead of replacing it with fresh state.

Proposed fix:

- Refresh task data whenever the selected project changes by re-running the fetch effect when the project ID changes.
- Update task state through immutable state updates so the UI re-renders immediately after toggling status or reopening a task.
- Add explicit TypeScript interfaces for the frontend component props and data shapes to prevent runtime issues from undefined props.
