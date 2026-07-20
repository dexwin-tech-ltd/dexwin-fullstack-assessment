- Location:AuthController
- Status: observed
- Evidence: the authController directly interacts with the db repository 
- Impact:
- Priority:
- Proposed solution: a service layer that handles all business logic and that also talks to the db repository
- Verification:
- Implementation notes:

- Location:AuthController/login-endpoint
- Status: observed
- Evidence: lacks a dto needed for payload validation
- Impact:
- Priority:
- Proposed solution: creating a dto to validate user imports
- Verification:
- Implementation notes:


- Location:AuthController/register
- Status: observed
- Evidence: request body is typed db schema requiring the client to enter id etc..
- Impact:
- Priority:
- Proposed solution: creating a dto to validate user imports and requiring user to enter only things needed
- Verification:
- Implementation notes:

- Location:client.ts
- Status: observed
- Evidence: base url hardcoded
- Impact:
- Priority:
- Proposed solution: creating a dto to validate user imports and requiring user to enter only things needed
- Verification:
- Implementation notes:

 Location:taskboard.ts
- Status: observed
- Evidence:  const next = task.status === 'DONE' ? 'TODO' : 'DONE';
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

 Location:projectlist.ts
- Status: sus
- Evidence:  getProjects().then(setProjects);
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


 Location:many files.ts
- Status: observed
- Evidence:  lack typing
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

 Location:frontend
- Status: observed
- Evidence:  marking task as completed not working as supposed to
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


 Location:frontend
- Status: observed
- Evidence:  reopening tasks not working as supposed to
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

 Location:frontend
- Status: observed
- Evidence:  all projects fetch the same task
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


 Location:frontend
- Status: observed
- Evidence:  task description doesn't show
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

 Location:frontend
- Status: observed
- Evidence:  frontend doesn't update after update
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

