## Finding: No response validateion

- Location: client.ts
- Status: observed
- Evidence: None of the APIs have any way of validating a response from the API
- Impact:
- Priority:
- Proposed solution: Include a valibot/zod schema parsing and verification pattern
- Verification:
- Implementation notes:

## Finding: No component props type safety for ProjectList.tsx

- Location: ProjectList.tsx
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: None of the APIs have any way of validating a response from the API
- Impact:
- Priority:
- Proposed solution: Properly type the ProjectList component so it's props have a definite shape
- Verification:
- Implementation notes:

## Finding: No component props type safety for TaskBoard.tsx

- Location: TaskBoard.tsx
- Status: observed
- Evidence: The component doesn't document the shape of props it accepts
- Impact:
- Priority:
- Proposed solution: Properly type the TaskBoard component so it's props have a definite shape
- Verification:
- Implementation notes:

## Finding: No type safety across the entire project, so data structures are not properly validated

- Location: TaskBoard.tsx
- Status: observed
- Evidence: It's unclear what the shapes of the data the project expects are
- Impact:
- Priority:
- Proposed solution: Provide proper types for the Tasks, Projects resource
- Verification:
- Implementation notes:

## Finding: Update endpoint puts the data in its query param

- Location: client.tsx
- Status: observed
- Evidence: The endpoint to update a task's status is `PUT /tasks/${taskId}/status?status=${status}`. While this work, it is non-standard and atypical. Move the payload to the body instead.
- Impact:
- Priority:
- Proposed solution: Move the update payload to the body of the API
- Verification:
- Implementation notes:

## Finding: Lint warning in TaskService.java

- Location: TaskService.java.tsx
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: The linter warns of an unchecked conversion issue `Type safety: The expression of type List needs unchecked conversion to conform to List<Task>`
- Impact:
- Priority:
- Proposed solution: Properly convert the da
- Verification:
- Implementation notes:

## Finding: Registration does not validate any data. It just saves the registration payload AuthController.java

- Location: AuthController.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Running the registration endpoint just saves the user details directly without verification. There's no check for whehter user is already registered, or any attempt to hash user password
- Impact:
- Priority:
- Proposed solution: Properly validate 
- Verification:
- Implementation notes:

## Finding: Login payload is unsecure: AuthController.java

- Location: AuthController.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: The API sends a basic structure that is easily guessed on login.
- Impact:
- Priority:
- Proposed solution: Return a proper token response like jwt
- Verification:
- Implementation notes:

## Finding: There's no pagination in the List all projects endpoint. ProjectController.java

- Location: ProjectController.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: The API sends a basic structure that is easily guessed on login.
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

## Finding: Server still sends 200 status codes when projects aren't found. ProjectController.java

- Location: ProjectController.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: The API sends a basic structure that is easily guessed on login.
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

## No proper error codes are sent to client in the event of an error. ProjectController.java

- Location: ProjectController.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: The API sends a basic structure that is easily guessed on login.
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

## No Input validation on project create endpoint. ProjectController.java

- Location: ProjectController.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: The API sends a basic structure that is easily guessed on login.
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:
