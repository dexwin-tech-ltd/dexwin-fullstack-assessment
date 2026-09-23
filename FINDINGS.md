## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


FINDING 1
No Error handling for client fns in the frontend/src/api/client.ts file
-Location: frontend/src/api/client.ts
-Priority: 2
- Proposed Solution:  wrap either the base request fn or the individual fns in try catch blocks to handle any errors returned from the backend

FINDING 2
No error handling in controller classes 
- Location: backend/src/main/java/controller
-Priority: 2
- Propose Solution: No exception handling. Each controller method should be wrapped in exception handling contexts where unexpected errors can be caught and duely formatted and return ed

FINDING 3
readability
- Location: frontend/src/components/ProjectList.tsx
-Priority: 3
- Propose Solution:  for the code block at line 8 i.e     getProjects().then(setProjects);....then is supposed to receive a callback which handles the data returned.

FINDING 4
Attribute accessing on the project entity or state is done unconditionally ignoring the fact that avalue might be null or not exist on the project which would lease to an attribute access error at runtime.
- Location: frontend/src/components/ProjectList.tsx
-Priority: 2
-status: fixed
- Propose Solution: Incorporate null check and optional chaining etc to allow for gracefully handle cases where attributes dont exist on a project

FINDING 5
For each new project , the user should see the list of that project's tasks after a request has been made to the backend to fetch thasks for that project yet only the first selected project's tasks are fetched. Any newly selected project does not trigger a fetch. Bug is from frontend/src/components/TaskBoard.tsx where the useEffect doesnt have a dependency whereas it should be dependent on projectId
- Priority: 1
- Location: frontend/src/components/TaskBoard.tsx
- status: fixed

FINDING 6
Upon clicking n complete for a task, a request is made to complete the task. However, the state of the task isnt refetched/ the projects tasks arent refresh hence the frontend ahows stale data/ui.
-Priority: 1
-Location: frontend/src/components/TaskBoard.tsx
-state: fixed

FINDING 7
The frontend TasksBoard keeps its own state for list of tasks and tries to update it and the backend task at ta goal. This can lead to a drift where , on network failure or backedn update failure, the frontend state diverges from the backend
the fix is to trust the backend as th esource of truth, hence any update action should trigger a refetch of the tasks list
-state: fixed
-proposed solution: use the backend tasks as the source of truth hence any successful updat eto any taskfor a project should trigger a refetch and reset the local state basically.