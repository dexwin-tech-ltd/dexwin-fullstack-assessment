## Finding: Database Credentials are exposed ✅

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:application.yml
- Impact: High
- Priority: High
- Proposed solution: Remove secrets from application.yml
- Verification: Connection creditials are not visible in commit history
- Implementation notes: Cha

## Finding: password is returned in api response

- Location:Controller/ authcontroller.java ✅
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Line 24
- Impact: High
- Priority:High
- Proposed solution: Add json ignore so it does not expose the entire user object
- Verification: It's a vulnerability issue for production code 
- Implementation notes:Add @JsonIgnore to password


## Finding: login returns 200 even if password is wrong ✅

- Location:Controller/ authcontroller.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Line 34 
- Impact: High
- Priority:High
- Proposed solution: Add json ignore so it does not expose the entire user object
- Verification: It's a vulnerability issue for production code 
- Implementation notes: return a proper validation error

## Finding: Cors exposes API
- Location:Controller/ All controller
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: Controller/ All controller
- Impact: High
- Priority:High
- Proposed solution: Add frontend link
- Verification: It's a vulnerability issue for production code and exposes api tp threats or unathorized access
- Implementation notes: @CrossOrigin(origins = "https://didactic-space-journey-pww6pv7wwppcqwx-5173.app.github.dev/")




## Finding: task title are blank ✅
- Location:frontend
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: frontend/src/components/TaskItem.tsx
- Impact: High
- Priority:High
- Proposed solution: return task title instead
- Verification: Tested on frontend
- Implementation notes: 

## Finding: switching projects does not reload task ✅
- Location:frontend
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence: frontend/src/components/TaskBoard.tsx
- Impact: High
- Priority:High
- Proposed solution: add projectId to the dependency array so we can refetch when it chnages
- Verification: Tested on frontend
- Implementation notes:



Backend
- Database Credentials are exposed (application.yml)
- password is returned in api response(authcontroller)
-login returns 200 even if password is wrong(authcontroller)
- Cors issue (Auth, project, Task)
-passwords are not hashed
-passwords are been compared as raw string which is very dangerous
- Sql injection 

Frontend
-task title are blank
-switching projects does not reload task
-Complete and reopen buttons do not update the Ui