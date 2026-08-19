1. Authentication available but no authorization guard
2. swallowing of request body fields in getTasks()
3. Cross-origin allowing all hosts. 

1. Frontend task list not updating when project is changed
2. UI not updated when a task is "COMPLETED" and clicking the button fires a query to set task to "TO-DO" (variable for task status is not state-controlled)
3. Grayed out (seemingly disabled) task button sending requests to update status but not updating UI
4. Task details (title, description) not visible
5. No prompt when first opening frontend
6. Requests appear to complete and only update on ui refresh. 
7. No automated test scripts (but also no documented requirements to guide tests)
8. Comments on tasks, and assignees not visible

## Finding: Authentication available but no authorization guard

- Location: backend/src/main/java/com/dexwin/taskflow/controller/ProjectController.java, backend/src/main/java/com/dexwin/taskflow/controller/TaskController.java
- Status: observed
- Evidence: No verification of whether a user has access to the requested resources. 
- Impact: All users have all access to all resources
- Priority: High
- Proposed solution: Implement an authentication guard on all resource requests
- Verification: Authenticated users can only access resources they created or have been assigned
- Implementation notes:


## Finding: swallowing of request body fields in getTasks()

- Location: /backend/src/main/java/com/dexwin/taskflow/controller/TaskController.java
- Status: observed
- Evidence: request params passed to the getTask controller function are not used for pagination, not consumed at all
- Impact: no pagination
- Priority: low-medium (depends on business value)
- Proposed solution:
- Verification: pagination exists and works on required endpoints
- Implementation notes:


## Finding: Cross-origin allowing all hosts. 

- Location: all controllers
- Status: observed
- Evidence: @CrossOrigin(origins = "*") decoration on all controller classes
- Impact: any client can connect to these endpoints as long as they have the backend URL
- Priority: high
- Proposed solution: allow only known hosts (ie. the clients that are meant to access the api)
- Verification: requests from clients outside the list of known hosts are denied
- Implementation notes:


## Finding: Frontend task list not updating when project is changed

- Location: UI
- Status: observed
- Evidence: observed in UI (/frontend/src/components/ProjectList.tsx uses a useEffect() with an empty dependency array to fetch project tasks. )
- Impact: selecting different projects doesn't load up their task lists
- Priority: high
- Proposed solution: add the selected project id to the dependency array for the useEffect used to fetch task lists.
- Verification: selecting each project loads up its task list without having to refresh the app.
- Implementation notes:


## Finding: UI not updated when a task status is changed using button

- Location: UI
- Status: observed
- Evidence: clicking the completed button is observed to not react
- Impact: users end up clicking the button multiple times, effectively undoing their request
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


