## Finding: concise title

- Location:
- Status: observed | suspected | confirmed | fixed | deferred
- Evidence:
- Impact:
- Priority:
- Proposed solution:
- Verification:
- Implementation notes:

```





- ProjectList file
- observed
- Api call isnt asynchronous
soolution: make api call asynchronous in useEffect



- TaskBoard file
- observed
- argument (task) is not typed

- TaskItem file
- observed
- arguments are not typed as well


- envs were not setup to handle api base url
solution: set up a .env to handle that



Backend
- observed
- cors('*') is declared on each controller
solution: set cors globally and specify allowed origins for security


- observed
- service methods are triggering n+1 query problem

-observed
- the repository methods are not making any calls

- envs were not setup to handle api base url
solution: set up a .env to handle that






UI

- complete task button not working across all tasks
solution: Fix local state changes properly

- Tasks unchange even after selecting different projects
solution: Fix local state changes properly

- the reopen button does not work or is disabled
solution: Fix local state changes properly

```
