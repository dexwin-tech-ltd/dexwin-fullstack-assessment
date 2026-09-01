## Finding: concise title

- Location: Task Service
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:Checks where not made for cases where a valid project id was not provided
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: Task Service
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:In the search method there is a possibility of sql injection due to the usage of "query" in the raw  sql format
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: Project service
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:Using repository methods directly in the controller
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: Project controller
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:No checks were made for present and valid path variables
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: Project controller
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:No path was provided for the create method
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: Project controller
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:No response statuses were sent for methods in the controller
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: Task controller
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:No response statuses were sent for methods in the controller
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

 Location: Auth controller
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:No response statuses were sent for methods in the controller
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

 Location: api
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:types were not provided for parameters
- Impact:
- Priority:
- Proposed solution:Provide types to improve parameter validations
- Verification:
- Implementation notes:

 Location: task board
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: a function is passed in as a prop and any changes made on the task board state will render all task items
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

 Location: task board
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: No error handling in useEffects when data is fetched
- Impact:
- Priority:
- Proposed solution:Add catch to data fetch for better error handling
- Verification:
- Implementation notes:

 Location: ProjectList
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: data fetching could be improved in useEffect with better error handling and loading state
- Impact:Improves user experience and return better error messages
- Priority:
- Proposed solution:Add catch to set error state when an error occurs
- Verification:
- Implementation notes:

 Location: ProjectList
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Type definitions for props in components
- Priority:
- Proposed solution:Types can be added for better error handling
- Verification:
- Implementation notes:

 Location: TaskItem 
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Button text does not change immediately when status is changed
- Priority:
- Proposed solution:Tasks can be added to the dependency array of useEffect so that it re-renders when a change is made on a task
- Verification:
- Implementation notes:

Location: client.ts
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Method only updates the status of a task but the method used was PUT 
- Priority:
- Proposed solution:Using a PATCH better reflects what the method does
- Verification:
- Implementation notes:

Location: client.ts
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Update task status returns an error from the backend since PUT was updated to PATCH 
- Priority:
- Proposed solution:Updating PUT to PATCH on frontend means backend should also get the same update
- Verification:
- Implementation notes: