TaskFlow - Findings Summary

1.Finding :Task titles use the wrong frontend property .

Location : frontend/src/components/TaskItem.tsx; - backend = Task.java
Status: suspected
Evidence: Backend and Api models use `title`, while the fontend renders `task.name`.
Impact: Task cards will likely appear without visible titles, making the board complcated to use.
Priority: High
Proposed solution: Update the component to render `task.title` instead of `task.name`
Verification:Open a project with seeded tasks and confirm each cards shows the expected task title.
Implementation notes: This should be a one-line frontend fix with no backend API change

2.Finding: Switching projects does not reload tasks .

Location:frontend/src/components/TaskBoard.tsx
Status: suspected
Evidence: The task-fetching `useEffect` depends on the `projectId` logically , but the dependency array is empty. 
Impact: Selecting a different project may continue shwing tasks from the previously selected project.
Priority: High
Proposed solution:Add projectId to the effect dependency array so tasks are refeteched whenever project changes.
Verification:Select one seeded project , note its tasks and switch to another project and confirm the displayed task lists
Implementation notes:Also consider guarding against failed fetches


3.Finding :Task completion updates mutate React state incorrectly .

Location: frontend/src/components/TaskBoard.tsx `handleToggle function`
Status: suspected
Evidence:The handler mutates a task object and calls `setTasks` with the same array reference.
Impact: React may not re-render reliably, so completed state can appear unchanged even if the backend updates succeed.
Priority: High
Proposed solution: Update state immutably using the setTasks ( prev => prev.map(...)), returning a new array and new task object for the updated task.Await the backend call and optionally .
Verification:Click complete on a TODO task and confirm the badge update immediately 
Implementation notes:

4.Finding: SQL injection risk in the task search.

Location:backend/src/main/java/dexwin/taskflow/service/TaskService.java (`search function`)
Status: suspected
Evidence: The search query is built using string concatenation with the user-provided `q` parameter.
Impact: Malicious input may alter the SQL query and expose or change data.
Priority: Critical
Proposed solution:
Verification:
Implementation notes:

5.Finding: Passwords are handled insecurely
Location: data.sql, User.java, AuthController.register
Status: suspected
Evidence: Seed data contains plaintext passwords ,registration does not hash passwords , and `User` entities may be serialized directly in API reponses.
Impact: Passwords maybe stored insecurely and potentially exposed through API responses.
Priority: Critical
Proposed solution:
Verification:
Implementation notes:
