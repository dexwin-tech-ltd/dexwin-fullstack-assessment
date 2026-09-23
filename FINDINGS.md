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
-Priority: 1
- Proposed Solution:  wrap either the base request fn or the individual fns in try catch blocks to handle any errors returned from the backend

FINDING 2
No error handling in controller classes 
- Location: backend/src/main/java/controller
-Priority: 1
- Propose Solution: No exception handling. Each controller method should be wrapped in exception handling contexts where unexpected errors can be caught and duely formatted and return ed

FINDING 3
- Location: frontend/src/components/ProjectList.tsx
-Priority: 2
- Propose Solution:  for the code block at line 8 i.e     getProjects().then(setProjects);....then is supposed to receive a callback wwhich handles the data returned.

FINDING 4
Attribute accessing on the project entity or state is done unconditionally ignoring the fact that avalue might be null or not exist on the project which would lease to an attribute access error at runtime.
- Location: frontend/src/components/ProjectList.tsx
-Priority: 2
- Propose Solution: