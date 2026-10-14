BUG-01
Title: On the project home page, when a user mark a task as completed, the system marks the other project task as completed

Severity: major

Steps to reproduce (exact):
1. Navigate to the TaskFlow home page
2. Left click on "Website Redesign" project
3. Notice 4 tasks that project
4. Mark a task in Tdo as "Complete", take not on the task position.
5. Left click on "Mobile App" project
6. Notice the same task position has been marked as "complete"


Expected: the task stauts should be tie per project 
Actual: All tasks on the same position of the other projects are makrs as "complete"



Evidence (screenshot note, response body, console/network observation)
BugReport\01\bug01.png

Who is hurt: 
(end user, admin, data integrity)

---------------------
BUG-02
Title: When the task endpoint is called "/api/tasks" the responds exposes user credentials, eg: user email and passowrd 

Severity: major

Steps to reproduce (exact):
1. Make a PUT http call to http://localhost:8080/api/tasks/1/status?status=DONE
2. Notice the Response has owner credentails being exposed

Expected: The user credentails are not not to be exposed in the responses of an api call due to security reasons
Actual: Owner passwords are exposed


Evidence (screenshot note, response body, console/network observation)
BugReport\02\bug02.png

Who is hurt: 
(admin, data integrity)


----------------------
BUG-03
Title:On the TaskFlow Home page, when a user mark a task as complete, the complete button does not change to "Reopen" 

Severity: major

Steps to reproduce (exact):
1. Navigate to the TaskFlow home page
2. Left click on "Website Redesign" project
3. Mark a task as complete
4. Notice the complete button is still visible to the user

Expected: the status button should take effect instanctly for user expecrience
Actual: The task status button does not chnage state


Evidence (screenshot note, response body, console/network observation)
BugReport\03\bug03.png
```
{
  "id": 1,
  "title": "Design landing page",
  "description": "Hero, features, footer",
  "status": "DONE",
  "priority": 1,
  "project": {
    "id": 1,
    "name": "Website Redesign",
    "description": "Revamp the marketing site",
    "owner": {
      "id": 1,
      "username": "alice",
      "email": "alice@dexwin.test",
      "password": "password123"
    }
  },
  "assignee": {
    "id": 1,
    "username": "alice",
    "email": "alice@dexwin.test",
    "password": "password123"
  },
  "createdAt": "2026-10-14T14:56:24.874369Z"
}
```

Who is hurt: 
(end user, admin)

--------------------------------



1. What you would cover before release overnight
The critical flows that will hit end users and the mvp of the PRD, so the focus should be on smoke and regression test

2. What you would skip and why


3. Highest risks if we ship as-is


4. Suggested go / no-go
