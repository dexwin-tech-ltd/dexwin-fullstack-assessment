## Finding: concise title


- Location: Project Screen
- Status: fixed 
- Evidence: The app doesn't fetch tasks of a given project
- Impact: Only the initial projects tasks are loaded
- Priority: high
- Proposed Add projectId to the useEffect of the Taskboard Screen
- Verification: App now fetches tasks based on the project
- Implementation notes:


- Location: Tasks list 
- Status: fixed 
- Evidence: The complete button on the task list doesn't react to click events
- Impact: Users are unable to change the status of tasks
- Priority: high
- Proposed The tasks list is now updated to contain the new changes
- Verification:
- Implementation notes:

- Location: Tasks list 
- Status: fixed 
- Evidence:  The api is sending title, however the frontend is using name instead
- Impact: The name of the task doesn't show on the list.
- Priority: high
- Proposed change task.name to task.title
- Verification:
- Implementation notes:

- Location: AuthController
- Status: observed 
- Evidence: The user password is not hashed
- Impact: Plan passwords are stored in the database
- Priority: high
- Proposed Hash the password before saving the user
- Verification:
- Implementation notes:

- Location: AuthController
- Status: observed 
- Evidence: The login does not send any token back to the frontend when a user provide correct credentials
- Impact: The server has no way to authorize, an authenticated user and one who is not
- Priority: high
- Proposed Provide JWT or any token to verify frontend application users
- Verification:
- Implementation notes:

- Location: ProjectController, TaskController
- Status: observed 
- Evidence: The api do not have any authorization scheme to know which user is making the call
- Impact: Users are able to fecth other user's projects and tasks
- Priority: high
- Proposed Protect api routes with JWT from login session to prevent users getting access to what they are not supposed to see
- Verification:
- Implementation notes:

- Location: ProjectController
- Status: observed 
- Evidence: The list of projects are not paginated
- Impact: When the application scale, there could be performance issues
- Priority: high
- Proposed Add pagination to the get project endpoint
- Verification:
- Implementation notes:

- Location: TaskController
- Status: observed 
- Evidence: Even though the api accepts paginated query paramenters, the actual data is not paginated
- Impact: When the application scale, there could be performance issues
- Priority: high
- Proposed Make use of the page size and page paramenters
- Verification:
- Implementation notes:




