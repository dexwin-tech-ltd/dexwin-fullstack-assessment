##  Finding: concise title

- Location: 
- Status: observed | suspected |  fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


## Backend Finding: concise title

- Location: TaskService.java
- Status: fixed
- Evidence: line 43, teh code puts the users search text directly into the databe query. S o a user could enter special SQL comands and likely change what the Databse does.
- Impact: 
- Priority: 
- Proposed solution:
- Verification:
- Implementation notes:

#2
- Location: TaskService.java
- Status:  suspected
- Evidence: possible N+1 query. line 31
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:


##  frontend Finding: concise title
#1
- Location: Taskboard.tsx
- Status:  Fixed 
- Evidence: The screen changes task status immediately but doesnt confirm from backend
- Impact:
- Priority:
- Proposed solution: Replaced the direct mutation + settask with an immutable update
- Verification:
- Implementation notes:

#2

- Location: Taskboard.tsx
- Status:  fixed
- Evidence: Each task uses their own positioin in the list as React key instead of unique ID
- Impact:
- Priority:
- Proposed solution: Added projectID to the useEffect dependency so each project loads on their own task list
- Verification:
- Implementation notes:

#3
- Location: Taskboard.tsx
- Status:  confirmed 
- Evidence: API errors are not handled.
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:




#Orange umbrella App interaction


- Location: Orange umbrella app
- Status: observed 
- Evidence: Marking complete on one project, the same task appears as complete in another project in the same section. Copletion status being shared across projects instead of being with one specificproject.
- Impact:
- Priority:
- Proposed solution: Added projectID to the useEffect dependency so each project loads on their own task list
- Verification:
- Implementation notes:

#2
- Location: Frontend, task card,  reopen button
- Status: observed
- Evidence: When i click on the Reopen button, the button doesnt reporn the task, hwerver the netoork tab sohows a repsonse changing/returning the status as TODO/DONE.
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

#3

- Location: Complete button
- Status: observed 
- Evidence: When i click on the complete button , the task does not immdediately appear as completed. unless refreshed 
- Impact:
- Priority:
- Proposed solution:  Replaced the direct mutation + settask with an immutable update
- Verification:
- Implementation notes: