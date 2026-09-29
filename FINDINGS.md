## Finding: concise title

- Location: 
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: 
- Impact: 
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: AuthController.java
- Status: deffered 
- Evidence: User password is saved as plain text and login checks against plain text
- Impact: 
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


- Location: AuthController.java
- Status:  deferred
- Evidence: Projects are not effectively scoped to a user
- Impact: 
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: Task page
- Status: Fixed 
- Evidence: Completing a stage does not change the status because the response from the api does not update the component
- Impact: User wont be able to see effective updates they make
- Priority: High
- Proposed solution: Use the respose received the update to update the state
- Verification:
- Implementation notes:

- Location: Projects Page
- Status: observed 
- Evidence: Switching between projects does not refresh task list because api request is made only once
- Impact: User unable to switch between projects and see the task under them
- Priority: High
- Proposed solution: Pass the projectId to useEffect as a condition to rerender and will trigger the app call to fetch the tasks related to the project
- Verification:
- Implementation notes:

- Location: Projects Page
- Status: observed 
- Evidence: double requests first when project is rendered and second when a project is clicked for the first time.
- Impact: Unnecessary second request 
- Priority: Low
- Proposed solution:
- Verification:
- Implementation notes:
