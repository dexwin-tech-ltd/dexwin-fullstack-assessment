
## Finding: concise title

- Location: ProjectController.java
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

## Finding 1: Missing API url in Projects COntroller in the GetMapping for all the projects (Important)

- Location: ProjectController.java
- Status: observed 
- Evidence: line 25 misses the url path for the GET request for the projects
- Impact: The /project url page will redirect to a 404 error page
- Priority: high
- Proposed solution: Add the /projects url mapping
- Verification: /projects to redirect 
- Implementation notes:

## Finding 2: Missing API url in Projects COntroller in the POSTMapping (Important)

- Location: ProjectController.java
- Status: observed 
- Evidence: line 35 misses the url path for the POST request for the projects
- Impact: No new project can be created
- Priority: high
- Proposed solution: Add the /projects url mapping after the PostMapping word
- Verification: No create project funtionality 
- Implementation notes:

## Finding: concise title

- Location: TaskBoard.tsx
- Status: suspected
- Evidence: line 25uses tasks.length
- Impact: Inaacurate number of tasks
- Priority: high
- Proposed solution: Use task.length instead
- Verification: Number of tasks is constant
- Implementation notes:

# FInding 3: Missing Create Task Form Component(Important)
- Missing create task form in the frontend
- Location: frontend/src/components
- Status: observed
- Evidence: the components folder misses the create task form
- Impact: User cannot create a task
- Priority: high
- Proposed solution: Add create task form and then connect it to the POST request api
- Verification: No creat task form
- Implementation notes:

# Findin 4: Missing Create Project Form Component(Important) 
Missing create task form in the frontend
- Location: frontend/src/components
- Status: observed
- Evidence: the components folder misses the create projct form
- Impact: User cannot create a project
- Priority: high
- Proposed solution: Add create task form and then connect it to the POST request api
- Verification: No create project form
- Implementation notes:

# Missing Comment Section Component(Important) 
- Missing comments component in the frontend
- Location: frontend/src/components
- Status: observed
- Evidence: the components folder misses the comment component
- Impact: User cannot see the comments
- Priority: high
- Proposed solution: Add comment component and attach it to both POST and GET backend requests
- Verification: No comment section
- Implementation notes:

# Project and Task Mismatch(Important)
- the tasks do not change when you click through the projects

# Missing Comment Urls i.e /comment for both GET and POST requests(Important)
- Missing api url for the comment section