## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:high | low
- Priority: high | low
- Proposed solution:
- Verification:
- Implementation notes:







- Location: AuthController.java
- Status: observed
- Evidence: When registering a user we need to make sure that we verify and sanitaize the data the user sent in the request. 
- Impact: If there is a duplicated user in the database we could end up with dirty db
- Priority: high 
- Proposed solution:
- Verification:
- Implementation notes:


- Location: ProjectRepository.java
- Status: observed
- Evidence: There is no function to create a project and retrieve a project
- Impact: if there isnt a fuction to support the api contract then projects cannot be created
- Priority: high 
- Proposed solution: Write the function to create and retrieve a project 
- Verification:
- Implementation notes:


- Location: client.ts
- Status: observed
- Evidence: For the api contracts, we are not parsing errors when request fails 
- Impact: If the is an error during the request, there is no proper way to manage it on the client. thus the user wouldn't know if a request is hanging
- Priority: high 
- Proposed solution: Always check if the response is ok if not return an error message
- Verification:
- Implementation notes:


- Location: ProjectList.tsx
- Status: observed
- Evidence: No loading skeleton 
- Impact: On first load, the user is unable to tell if the projects are loading or being fetched. This doesnt give a smooth product experience
- Priority: high 
- Proposed solution: show a loading skeleton on firt load
- Verification:
- Implementation notes:


- Location: TaskFlow UI
- Status: observed
- Evidence: Task list item does not show title of the task
- Impact: A user cannot be able to identify which task they need to work on since title is missing
- Priority: high
- Proposed solution:Check if the task has a title and display it, if not show a fallback (No title)
- Verification:
- Implementation notes:

- Location: TaskFlow UI
- Status: observed
- Evidence: Clicking project tabs does not filter through task lists 
- Impact: A user cannot be able to filter throught tasks belonging to a project tab, thus shows stale data.
- Priority: high
- Proposed solution: Only show tasks that belong to a selected project tab
- Verification:
- Implementation notes:

- Location: Task item card
- Status: observed
- Evidence: Clicking 'Complete'  button does not update the list card ui 
- Impact: Without a visual confirmation, a user will continue clicking the complete button repeatedly. this gives a notion that the app is broken.
- Priority: high
- Proposed solution: Add a loading spinner to the button, this shows if the request is in the pending state
- Verification:
- Implementation notes: