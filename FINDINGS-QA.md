## Bugs

### Bug-001
Title: Tasks don't show per selected project
Severity: Blocker. User is unable to see tasks in all projects
Steps to reproduce:
1. Navigate to TaskFlow dashboard
2. Click on a project, view tasks under project
3. Click on a different project in the list
Expected: The corresponding list of tasks displayed per project changes to reflect the selected project
Actual: Only the tasks for the initially selected project shows. Unable to view tasks in other projects when they're selected
Evidence: [Bug-001A](bug-screenshots/Bug-001A.png) & [Bug-001B](bug-screenshots/Bug-001B.png)
Who is hurt: End user

### Bug-002
Title: Tasks are not titled
Severity: Major. Users are unable to distinguish between different tasks assigned since tasks are not titled
Steps to reproduce:
1. Navigate to TaskFlow dashboard
2. Click on a project, view tasks under project
Expected: Tasks are listed with details such as title, description, owner, status, etc
Actual: No descriptive info on tasks is provided. No title or description for users to identify them
Evidence: [Bug-002](bug-screenshots/Bug-002.png)
Who is hurt: End user

### Bug-003
Title: Users' sensitive information made public
Severity: Major. It doesn't affect or block functionality but it's a serious risk and breaches consumers' data protection
Steps to reproduce:
1. Open your browser developer tools and navigate to the networks tab
2. Navigate to TaskFlow dashboard
3. Open the 'projects' request item and preview the response 
Expected: Projects listed with their various details 
Actual: Projects listed with the login credentials of project owners
Evidence: [Bug-003](bug-screenshots/Bug-003.png)
Who is hurt: Data Integrity, End user

### Bug-004
Title: Tasks status does not update unless page is refreshed
Severity: Blocker. The main functionality to track tasks status as employees work is non-existent. 
Steps to reproduce:
1. Navigate to TaskFlow dashboard
2. Click on a project, view tasks under project
3. Click 'complete' on a task that is yet to be done
Expected: The task status changes to 'done' and the complete button changes to 'reopen'
Actual: Task status remains the same, complete button remains intact
Evidence: [Bug-004A](bug-screenshots/Bug-004A.png) & [Bug-004B](bug-screenshots/Bug-004B.png)
Who is hurt: Admin, End user