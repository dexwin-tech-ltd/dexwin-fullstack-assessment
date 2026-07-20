# Findings

## Finding: SQL injection in task search endpoint

- Location: `backend/src/main/java/com/dexwin/taskflow/service/TaskService.java:43`
- Status: observed
- Evidence: `String sql = "SELECT * FROM tasks WHERE title LIKE '%" + query + "%'";` — user-supplied input is concatenated directly into a native SQL query with no sanitization or parameterization.
- Impact: An attacker can read, modify, or delete arbitrary database rows via the publicly accessible `GET /api/tasks/search?q=...` endpoint.
- Priority: Critical
- Proposed solution: Replace with a JPA Criteria query, `@Query` with a named parameter (`LIKE %:query%`), or use `Querydsl`/Specification.
- Verification: Send a request with `q=' OR 1=1; --` and confirm no data leak; send normal queries and confirm they still work.

---

## Finding: Plaintext password storage

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java:24-25,33`, `backend/src/main/java/com/dexwin/taskflow/entity/User.java:24-25`, `backend/src/main/resources/data.sql:1-6`
- Status: observed
- Evidence: `register()` saves `user.getPassword()` directly with no hashing. `login()` compares via `.equals(password)` — plaintext comparison. Seed data contains passwords like `password123`, `hunter2`, `letmein`.
- Impact: Any database compromise exposes all credentials in plaintext. Credentials are also visible in logs and seed files.
- Priority: Critical
- Proposed solution: Add `spring-boot-starter-security`, hash passwords with `BCryptPasswordEncoder` on registration, verify with `matches()` on login.
- Verification: Register a new user, check DB shows a bcrypt hash (starts with `$2a$`), log in with correct and incorrect passwords.

---

## Finding: Login endpoint throws 500 on invalid username (user enumeration oracle)

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java:32-34`
- Status: observed
- Evidence: `userRepository.findByUsername(username).orElseThrow()` throws `NoSuchElementException` when the username doesn't exist — returned as HTTP 500. If username exists but password is wrong, returns HTTP 200 with `authenticated: false`. Attackers can distinguish "user not found" from "wrong password" by both status code and response shape.
- Impact: Enables valid-username enumeration, making brute-force and phishing attacks more effective.
- Priority: High
- Proposed solution: Replace with `orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"))` and return a uniform 401 response for both cases. Add a `@ControllerAdvice` to map authentication exceptions to 401.
- Verification: Send login with non-existent username → 401, send with valid username + wrong password → 401, both with identical response shape.

---

## Finding: Register endpoint returns password in response

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java:24`
- Status: observed
- Evidence: `register()` returns the raw `User` entity directly from `userRepository.save(user)`, which serialises the `password` field into the HTTP response body.
- Impact: The client receives the (plaintext) password in the registration response, exposing secrets to browser history, network logs, and any JS running on the page.
- Priority: High
- Proposed solution: Use a DTO/record for the response that excludes the password field (or annotate `password` with `@JsonIgnore` on the entity).
- Verification: Register a user and confirm the response JSON contains no `password` field.

---

## Finding: No authentication mechanism — auth endpoints return raw user ID

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java:34`
- Status: observed
- Evidence: `login()` returns `Map.of("authenticated", ok, "userId", user.getId(), "username", ...)` with no JWT, session cookie, or API token. There is no mechanism for subsequent requests to prove identity.
- Impact: Any "protected" endpoints (e.g., assigning tasks, ownership checks) cannot verify the caller's identity. The entire auth system is effectively non-functional.
- Priority: High
- Proposed solution: Integrate Spring Security with JWT (stateless) or HTTP session (stateful). Return a token on login; validate on every subsequent request.
- Verification: Log in, extract token, use token to call a protected endpoint, verify token expiry returns 401.

---

## Finding: No input validation on any request body

- Location: All controllers — `AuthController.java:24`, `TaskController.java:51-54`, `TaskController.java:63-64`, `ProjectController.java:36-37`
- Status: observed
- Evidence: No controller uses `@Valid` on request bodies. Entity fields lack `@NotBlank`, `@Email`, `@Size`, `@Pattern` annotations. The `spring-boot-starter-validation` dependency is present in `pom.xml` but is not used.
- Impact: Malformed, empty, or malicious data can be persisted. DB constraint violations surface as raw 500 errors.
- Priority: High
- Proposed solution: Add `@Valid` to controller parameters. Add `jakarta.validation` annotations to entity fields. Create specific DTOs with validation rules.
- Verification: POST with empty title → 400 Bad Request. POST with valid data → 200.

---

## FRONTEND: Missing `projectId` in `useEffect` dependency array (stale data bug)

- Location: `frontend/src/components/TaskBoard.tsx:12`
- Status: fixed
- Evidence: `useEffect(() => { getTasks(projectId).then(setTasks); }, []);` — `projectId` is referenced inside the effect but omitted from the dependency array. The effect runs only on mount, so switching to a different project still shows the first project's tasks.
- Impact: **Broken core feature.** Users cannot see tasks for different projects. The board appears to work but always shows stale data.
- Priority: Critical
- Proposed solution: Add `projectId` to the dependency array: `useEffect(() => { ... }, [projectId]);`
- Verification: Click two different projects in the sidebar → the task board loads the correct tasks for each.
- Implementation notes: Added `projectId` to useEffect deps. Also wrapped fetch logic in a named `loadTasks` function so the retry button can re-invoke it.

---

## FRONTEND: Direct state mutation in `handleToggle` — React may skip re-render

- Location: `frontend/src/components/TaskBoard.tsx:14-18`
- Status: fixed
- Evidence: `task.status = next; setTasks(tasks);` mutates the task object in-place and passes the same array reference to `setTasks`. React's `useState` uses `Object.is` comparison — since the reference hasn't changed, React may skip the re-render.
- Impact: Clicking the Complete/Reopen button may appear to do nothing. The UI becomes inconsistent with the server state.
- Priority: Critical
- Proposed solution: Create a new array with the updated task: `setTasks(tasks.map(t => t.id === task.id ? { ...t, status: next } : t))`.
- Verification: Click "Complete" on a task → the UI immediately reflects the new status. Click "Reopen" → reverts.
- Implementation notes: Changed to `setTasks(tasks.map(t => t.id === task.id ? { ...t, status: next } : t))`. Added `.catch()` on the API call with a rollback via `loadTasks()` on failure.

---

## FRONTEND: No HTTP error checking in API client — error responses treated as success

- Location: `frontend/src/api/client.ts:3-5`
- Status: fixed
- Evidence: `const res = await fetch(...); return res.json();` — there is no `if (!res.ok)` check. Any HTTP error (4xx, 5xx) is parsed as JSON and returned as if it were valid data.
- Impact: Components receive error payloads as their state, causing rendering crashes or misleading empty states. Users never see error messages from the server.
- Priority: High
- Proposed solution: Add `if (!res.ok) throw new ApiError(res.status, await res.text());` in `request()`. Add a `.catch()` or error state at every call site.
- Verification: Stop the backend, try to load projects → UI shows an error message, not a blank screen.
- Implementation notes: Added `ApiError` class, `res.ok` check in `request()`, typed all return values, and added `.catch()` handlers with error state in all components.

---

## FRONTEND: No error handling on any API call — unhandled promise rejections

- Location: `frontend/src/api/client.ts:4-5`, `frontend/src/components/ProjectList.tsx:8`, `frontend/src/components/TaskBoard.tsx:9,18`
- Status: fixed
- Evidence: `fetch(...)` has no `try/catch`. `getProjects().then(setProjects)` and `getTasks(projectId).then(setTasks)` have no `.catch()`. `updateTaskStatus(task.id, next)` is fire-and-forget with no error handling.
- Impact: Network failures cause unhandled promise rejections. Users see a blank/loading UI with no error feedback and no way to retry.
- Priority: High
- Proposed solution: Add `.catch()` handlers at each call site. Introduce error state variables in components. Show user-facing error messages with retry buttons.
- Verification: Disconnect from the API, verify each component shows an error message instead of breaking silently.

---

## FRONTEND: `TypeScript strict: false` disables all type checking

- Location: `frontend/tsconfig.json:16`
- Status: fixed
- Evidence: `"strict": false` disables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`.
- Impact: Every function parameter and variable in the codebase is implicitly `any`. Runtime type errors that would be caught at compile time instead crash the app.
- Priority: High
- Proposed solution: Set `"strict": true`. Fix the resulting type errors across the codebase. Add proper interfaces for `Project`, `Task`, `User`, etc.
- Verification: `tsc --noEmit` passes with zero errors.
- Implementation notes: Set `strict: true` in tsconfig.json, created `types.ts`, typed all component props and API client.

---

## FRONTEND: No type definitions for entities — implicit `any` throughout

- Location: Missing — no `.types.ts` or type definition file exists
- Status: fixed
- Evidence: No interfaces for `Project`, `Task`, `User`, `Comment`, `ApiResponse`, etc. are defined anywhere in the frontend. All API functions return `Promise<any>` and all props are untyped.
- Impact: Zero type safety. Impossible to enforce API contracts. Refactoring is error-prone.
- Priority: High
- Proposed solution: Create `frontend/src/types.ts` with interfaces mirroring the backend entities and API responses. Type all API functions and component props.
- Verification: `tsc --noEmit` passes. Components access typed properties with IDE autocompletion.

---

√√ ## FRONTEND: No loading, empty, or error states in components

- Location: `frontend/src/components/ProjectList.tsx:4-30`, `frontend/src/components/TaskBoard.tsx:5-33`
- Status: fixed
- Evidence: Neither component has loading/error state variables. While data is loading, the UI renders an empty panel. On API failure, the error is swallowed. There is no retry mechanism. When data is empty, there is no feedback (e.g., "No projects yet").
- Impact: Poor UX — users cannot tell if the app is loading, if it failed, or if there's simply no data. On slow networks the app appears broken.
- Priority: Medium
- Proposed solution: Add `loading`, `error`, and (where appropriate) state variables. Render spinners/skeletons during loading, error messages with retry buttons on failure, and empty state messages for empty results.
- Verification: Simulate slow network → loading indicator appears. Simulate API failure → error with retry shows. Return empty array → "No projects" message.

---

√√ ## FRONTEND: `task.name` vs backend `title` — field name mismatch

- Location: `frontend/src/components/TaskItem.tsx:15` vs `backend/src/main/java/com/dexwin/taskflow/entity/Task.java:27`
- Status: fixed
- Evidence: `TaskItem.tsx` renders `{task.name}`, but the backend `Task` entity defines `private String title` (serialised as `"title"` in JSON). The property `name` does not exist on the API response, so the task title renders as blank/undefined.
- Impact: **Every task title displays as blank in the UI.** Users see cards with no task names.
- Priority: Critical
- Proposed solution: Change `task.name` to `task.title` in `TaskItem.tsx:15`.
- Verification: Open the app, select a project → task cards show correct titles.

---

√√ ## FRONTEND: Array index used as React `key` instead of task ID

- Location: `frontend/src/components/TaskBoard.tsx:29`
- Status: fixed
- Evidence: `tasks.map((task, index) => <TaskItem key={index} ... />)` uses the array index as the key prop.
- Impact: If tasks are reordered or filtered, React misidentifies DOM nodes, leading to stale UI, lost focus, and incorrect animation transitions.
- Priority: Medium
- Proposed solution: Use `task.id` as the key: `key={task.id}`.
- Verification: `tsc --noEmit` passes (assuming task.id is typed). Task reordering in the list maintains correct UI state.

---

## FRONTEND: `useState(null)` in App infers `null`, not `number | null`

- Location: `frontend/src/App.tsx:6`
- Status: fixed
- Evidence: `const [selectedProjectId, setSelectedProjectId] = useState(null);` — TypeScript infers `useState<null>`, allowing only `null` to be assigned. The actual value `project.id` (a number) would be a type error under `strictNullChecks`.
- Impact: With `strict: true`, this would be a compile error. Currently masks a type safety gap.
- Priority: Low
- Proposed solution: Add explicit type: `useState<number | null>(null)`.
- Verification: `tsc --noEmit` passes without inference warnings.

---

## Finding: No global exception handler — raw 500 errors with stack traces

- Location: All controllers — `backend/src/main/java/com/dexwin/taskflow/controller/`
- Status: observed
- Evidence: There is no `@ControllerAdvice` or `@ExceptionHandler`. Exceptions like `NoSuchElementException`, `DataIntegrityViolationException`, and `IllegalArgumentException` are returned as Spring Boot's default error response (status 500 with full stack trace).
- Impact: Stack traces leak internal implementation details. API consumers cannot distinguish error types (404 vs 400 vs 500) reliably. Bad developer experience.
- Priority: Medium
- Proposed solution: Create a `@ControllerAdvice` with exception handlers for common exception types. Return consistent JSON error bodies with appropriate HTTP status codes.
- Verification: Request a non-existent project → 404 with clean JSON body. Bad request → 400. Server error → 500 with no stack trace.

---

## Finding: Pagination parameters declared but ignored

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/TaskController.java:39-42`
- Status: observed
- Evidence: `getTasks()` accepts `page` and `size` `@RequestParam` but never uses them — it always calls `taskRepository.findByProjectId(projectId)` which returns all tasks.
- Impact: Growing task lists will cause performance degradation. The API contract is misleading.
- Priority: Medium
- Proposed solution: Either accept `Pageable pageable` and return `Page<Task>`, or remove the parameters if pagination is deferred.
- Verification: Request with `?page=0&size=5` → only 5 tasks returned. Response includes `totalElements`, `totalPages`, etc.

---

## Finding: N+1 query issue in `getTaskSummaries()`

- Location: `backend/src/main/java/com/dexwin/taskflow/service/TaskService.java:29-37`
- Status: observed
- Evidence: For each task, `task.getAssignee()` (lazy `@ManyToOne`) and `task.getComments().size()` (lazy `@OneToMany`) are accessed inside the loop, triggering N additional SQL queries per task.
- Impact: With 100 tasks, this generates 1 + 2×100 = 201 database round trips. Significant performance degradation under load.
- Priority: Medium
- Proposed solution: Use `JOIN FETCH` in the repository query or `@EntityGraph` to eagerly fetch assignee and comment count in a single query.
- Verification: Enable SQL logging and confirm only one or two queries execute for the entire `getTaskSummaries` call.

---

## Finding: Missing `@Transactional` on service methods

- Location: `backend/src/main/java/com/dexwin/taskflow/service/TaskService.java:26,42,47`
- Status: observed
- Evidence: None of the service methods are annotated with `@Transactional`. Methods like `updateStatus()` that first load then save an entity can have consistency issues under concurrent access.
- Impact: Potential lost updates when two users modify the same task simultaneously.
- Priority: Medium
- Proposed solution: Add `@Transactional(readOnly = true)` on read methods and `@Transactional` on write methods at the class or method level.
- Verification: Unit test with concurrent `updateStatus` calls → no lost updates.

---

## Finding: No Spring Security dependency despite auth endpoints

- Location: `backend/pom.xml:24-53`
- Status: observed
- Evidence: The project has `AuthController` with login/register endpoints but no `spring-boot-starter-security` dependency. The `spring-boot-starter-validation` dependency is included but unused.
- Impact: No framework support for password encoding, CSRF protection, session management, or endpoint authorization. The entire auth layer is custom and broken.
- Priority: High
- Proposed solution: Add `spring-boot-starter-security` and configure a `SecurityFilterChain` with appropriate rules.
- Verification: App starts without security auto-configuration errors. Auth endpoints still work.

---

## Finding: No tests exist

- Location: `backend/src/test/` (empty directory)
- Status: observed
- Evidence: The `src/test` directory exists but contains no test files. The `spring-boot-starter-test` dependency is unused.
- Impact: Zero test coverage. No regression protection. Bugs in the critical auth and search logic are not caught.
- Priority: Medium
- Proposed solution: Add unit tests for `TaskService` (especially `search`), integration tests for controllers, and repository tests.
- Verification: `./mvnw test` passes.

---

## Finding: `ddl-auto: update` in production config

- Location: `backend/src/main/resources/application.yml:11`
- Status: observed
- Evidence: `hibernate.ddl-auto: update` causes Hibernate to auto-create/alter database tables based on entity definitions. This is dangerous in production.
- Impact: Hibernate can drop columns or tables unintentionally on entity changes, causing data loss or downtime.
- Priority: Medium
- Proposed solution: Use `validate` in production (or `none` with explicit migration tooling like Flyway/Liquibase). Keep `update` for development only via a profile.
- Verification: Set to `validate`, start app on existing schema → no errors. Entity changes no longer auto-migrate.

---

## Finding: Hardcoded database credentials in plaintext

- Location: `backend/src/main/resources/application.yml:6-8`
- Status: observed
- Evidence: Database URL, username (`taskflow`), and password (`taskflow`) are hardcoded in the committed YAML file.
- Impact: Credentials are leaked to anyone with source access. No way to rotate secrets without a code change.
- Priority: Medium
- Proposed solution: Use environment variables (`SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`) or a secrets manager. The YAML defaults should reference `${...}` placeholders.
- Verification: Start with `SPRING_DATASOURCE_PASSWORD=override` → app uses the env var value.

---

## Finding: Missing `unique = true` on User.email

- Location: `backend/src/main/java/com/dexwin/taskflow/entity/User.java:21-22`
- Status: observed
- Evidence: `username` has `@Column(nullable = false, unique = true)` but `email` has only `@Column(nullable = false)` — no unique constraint.
- Impact: Multiple users can register with the same email address, breaking identity assumptions and potentially causing account confusion.
- Priority: Medium
- Proposed solution: Add `unique = true` to the `email` field's `@Column` annotation.
- Verification: Insert two users with the same email → second insert fails with constraint violation. Uniqueness is enforced at both JPA and DB level.

---

## Finding: Entity fields nullable without constraints

- Location: `backend/src/main/java/com/dexwin/taskflow/entity/Project.java:24,26`, `backend/src/main/java/com/dexwin/taskflow/entity/Task.java:27`, `backend/src/main/java/com/dexwin/taskflow/entity/Comment.java:20`
- Status: observed
- Evidence: `Project.name`, `Project.description`, `Task.title`, and `Comment.content` all lack `@Column(nullable = false)`. These fields are logically required but can be persisted as null.
- Impact: Inconsistent data in the database. Potential null-pointer exceptions in the frontend when rendering these fields.
- Priority: Medium
- Proposed solution: Add `nullable = false` to these columns and `@NotBlank` validation annotations.
- Verification: Attempt to save entity with null field → `DataIntegrityViolationException`. API returns 400.

---

## Finding: `CascadeType.ALL` on Project.tasks risks cascading data loss

- Location: `backend/src/main/java/com/dexwin/taskflow/entity/Project.java:33`
- Status: observed
- Evidence: `@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)` — deleting a Project cascades delete to all its Tasks, which in turn cascade-deletes their Comments.
- Impact: Accidental project deletion causes irreversible loss of potentially hundreds of tasks and comments.
- Priority: Medium
- Proposed solution: Consider removing `CASCADE` or at minimum not cascading remove. Use soft deletes or explicit archive logic.
- Verification: Delete a project and confirm associated tasks are not automatically removed (or implement explicit archive).

---

## Finding: CORS configured with `origins = "*"` globally

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java:14`, `TaskController.java:23`, `ProjectController.java:16`
- Status: observed
- Evidence: Every controller has `@CrossOrigin(origins = "*")`, allowing any origin to make requests.
- Impact: Any website can make cross-origin requests to the API. Combined with no authentication, this widens the attack surface.
- Priority: Low
- Proposed solution: Restrict CORS to known origins (e.g., the frontend URL). Remove the annotation from individual controllers and configure globally via a `WebMvcConfigurer` bean.
- Verification: Request from an unlisted origin → CORS error. Request from listed origin → success.

---

## Finding: `ProjectController.getById` returns null instead of 404

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/ProjectController.java:31-32`
- Status: observed
- Evidence: `return projectRepository.findById(id).orElse(null);` — returns `null` when the project doesn't exist, which Spring Boot serialises as a 200 OK with empty body.
- Impact: Clients cannot distinguish between "not found" and a null response. Breaks REST conventions.
- Priority: Medium
- Proposed solution: Replace with `.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"))`.
- Verification: GET `/api/projects/9999` → 404 with descriptive JSON body.

---

## FRONTEND: No retry mechanism for failed API calls

- Location: `frontend/src/components/ProjectList.tsx`, `frontend/src/components/TaskBoard.tsx`
- Status: fixed
- Evidence: API call failures are silent (no `.catch()`), and there is no retry button or `useEffect` re-trigger. Users must manually refresh the page.
- Impact: Poor UX — transient network failures require a full page reload.
- Priority: Low
- Proposed solution: Add error state with a "Retry" button that re-invokes the fetch function.
- Verification: Simulate network failure → error message and retry button appear. Click retry → data loads.

---

## FRONTEND: Unused `import React` in main.tsx (React 18 JSX transform)

- Location: `frontend/src/main.tsx:1`
- Status: fixed
- Evidence: `import React from 'react'` is unused with the `"jsx": "react-jsx"` setting in `tsconfig.json`.
- Impact: Code smell. Unused import is harmless but indicates lack of cleanup. Will trigger lint warnings if a linter is added.
- Priority: Low
- Proposed solution: Remove the unused import.
- Verification: App builds and runs without change.

---

## FRONTEND: No null check on `document.getElementById('root')`

- Location: `frontend/src/main.tsx:6`
- Status: fixed
- Evidence: `ReactDOM.createRoot(document.getElementById('root'))` — `getElementById` returns `HTMLElement | null`; no null guard.
- Impact: If `<div id="root">` is missing, the app crashes with `TypeError: Cannot read properties of null`.
- Priority: Low
- Proposed solution: Add `if (!rootElement) throw new Error('Root element not found');` or use a non-null assertion with a comment.
- Verification: Remove `id="root"` from `index.html` → clear error message, not a cryptic TypeError.

---

## FRONTEND: No error boundary — unhandled exceptions unmount entire UI

- Location: `frontend/src/App.tsx`
- Status: fixed
- Evidence: No React error boundary existed anywhere in the component tree. Any unhandled render exception would unmount the entire application, showing a white screen.
- Impact: A single runtime error (e.g., accessing `undefined.username`) destroys the entire UI with no fallback for the user.
- Priority: Medium
- Proposed solution: Add a class-based error boundary component wrapping the app.
- Verification: Throw an error in a child component → error boundary shows a fallback UI with a reload button instead of a white screen.
- Implementation notes: Created `frontend/src/components/ErrorBoundary.tsx` wrapping the entire app tree. Displays error message and reload button on failure.

---

## Priorities summary

| Priority | Count | Key issues |
|----------|-------|------------|
| Critical | 4 | SQL injection, plaintext passwords, stale task board data (missing dep), task title field mismatch |
| High     | 8 | Auth 500/user enumeration, password in response, no auth mechanism, no input validation, no error handling on API calls, `strict: false`, no entity types, no Spring Security |
| Medium   | 13 | No loading/empty/error states, array index key, N+1 queries, missing `@Transactional`, no tests, `ddl-auto: update`, hardcoded creds, email unique constraint, nullable entity fields, cascade data loss, pagination ignored, getById returns null, no global exception handler, no error boundary |
| Low      | 4 | Retry mechanism, unused import, no null check on root element, CORS `*`, `useState(null)` |

### Frontend fix status

All 13 frontend findings have been fixed and verified:

- **Critical (3):** stale data bug, state mutation, `task.name`→`task.title`
- **High (4):** API error handling, promise rejections, `strict: true`, type definitions
- **Medium (4):** loading/empty/error states, array index key, error boundary, retry mechanism
- **Low (3):** `useState` type, unused import, null check on root element

## Issues explicitly deferred (would address with more time)

1. Rate limiting on auth endpoints
2. `show-sql: true` in config (info leak)
3. `sql.init.mode: always` running seed data every startup
4. Missing favicon and meta tags in `index.html`
5. No ESLint/Prettier configuration
6. Missing `findByEmail` in `UserRepository`
7. `createdAt` setter should be removed or column made non-updatable
8. Lazy loading without `@Transactional` in controllers (fragile)
