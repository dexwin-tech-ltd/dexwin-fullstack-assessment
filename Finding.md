## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

- Location: application.yml
- Status: observed 
- Evidence:`  datasource:
  url: jdbc:postgresql://localhost:5432/taskflow
  username: taskflow
  password: taskflow`
- Impact: 
- Priority:low
- Proposed solution: externalize configs
- Verification:
- Implementation notes:


- Location: AuthController
- Status: observed
- Evidence:`   private final UserRepository userRepository;`
- Impact: 
- Priority: low
- Proposed: inject service 
- Verification:
- Implementation notes:
- 
- Location: AuthController
- Status: observed
- Evidence:`  public Map<String, Object> login(@RequestBody Map<String, String> credentials) `
- Impact:
- Priority: high
- Proposed: use dtos and validate  
- Verification:
- Implementation notes:


- Location : taskController
- Status: observed
- Evidence:`  public Map<String, Object> login(@RequestBody Map<String, String> credentials) `
- Impact:
- Priority: high
- Proposed: use dtos and validate the request objects
- Verification:
- Implementation notes:

- Location : taskController
- Status: observed
- Evidence:`     public List<Task> getTasks(@PathVariable Long projectId,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return taskRepository.findByProjectId(projectId); // page, size not used `
- Impact:
- Priority: midum 
- Proposed:  use the page, and size variables to build the paginations
- Verification:
- Implementation notes

-> inject service class instead direct access to repository | low
-> the business logic should be in a service class 
-> no dto -> just using the user object -> no validations -> saving directly to db -> high -> register
-> login -> 


-> inversion of control and DI -> no enforcement of boundariess -> i.e injecting repositorys
-> create -> no dto -> no validations
