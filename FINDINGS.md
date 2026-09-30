## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
<!-- later -->
- Proposed solution:
- Verification:
- Implementation notes:


<!-- issue 1 -->
- Location: ProjectRepository.java line: 6
- Status: observed
- Evidence: the ProjectRepository interface is empty 
- Impact: this might break the projects api when dealing with project resources.
- Priority: High

<!-- Stage 2 issue 1 -->
- Location: frontend
- Status: observed
- Evidence: the user from the backend shows raw password 
 ```json
 "owner": {
            "id": 1,
            "username": "alice",
            "email": "alice@dexwin.test",
            "password": "password123" // culprit
        }
 ```
- Impact: this is security risk
- Priority: High risk



<!-- Stage 2 issue 2 -->
- Location: frontend
- Status: fixed
- Evidence: the status transition is broken so user never gets to move task through the various phases
- Impact: This is a bug that will impact the UX of the app and make it unusable
- Priority: High
- Proposed solution: add the tasks as a dempendancy array which will cause a refresh when the status of a task changes
- Verification: the status of a task now chnages on the fly when toggled
- Implementation notes:




<!-- Stage 2 issue 3 -->
- Location: frontend
- Status: observed
- Evidence: the list of tasks do not update when a project is selected / there is no api call for data
- Impact: This is a bug that will impact the UX of the app and make it unusable
- Priority: High
- Proposed solution: add the tasks as a dempendancy array which will cause a refresh when the project value changes
- Verification: the list of tasks now updates when we change projects
- Implementation notes:


<!-- Stage 2 issue 4 -->
- Location: frontend
- Status: observed
- Evidence: there is no way to add new task on the frontend
- Impact: This is a bug that will impact the UX of the app and make it unusable
- Priority: High


<!-- Stage 2 issue 5 -->
- Location: frontend
- Status: observed
- Evidence: there are missen task details on the task cards
- Impact: This is a bug that will impact the UX of the app
- Priority: High
- Proposed solution: inspect the task object and ensure we are acessing the right parameters
- Verification: the list of tasks now show correctly the tittle and description of tasks
- Implementation notes: