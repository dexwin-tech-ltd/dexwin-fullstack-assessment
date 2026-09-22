Frontend

## Finding: concise title

- Location: in ProjectList comp
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority: high,
- Proposed solution: 
- Verification:
- Implementation notes:



in TaskRepo
-- List<Task> findByProjectId(Long projectId);
 -- no repo annotation on it


 Comment repo
 List<Comment> findByTaskId(Long taskId);
 --



 Going through the UI
 -- no loading or indicating that an action is happending when click on button
 Status of task does not change in the UI even though the backend response.

 solution Frontend
 --Added the method and loading state when updating the task.

 --Added getTasks implmentation in the useEffect in the TaskBoard

 Backend 
 resolve the issue with SQL injection in search for tasks

-- Added repository annotation