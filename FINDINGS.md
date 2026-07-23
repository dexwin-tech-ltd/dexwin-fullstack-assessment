# FINDINGS

# Frontend

## Finding: TypeScript strict mode disabled

- Location: `frontend/tsconfig.json:16`
- Status: confirmed
- Evidence: `"strict": false`  the project is TS but gets little type-safety benefit from it.
- Impact: Type errors (e.g. the `task.name`/`title` bug below) aren't caught at compile time.
- Priority: Medium
- Proposed solution: Set `"strict": true` and fix the resulting errors incrementally.
- Verification: `cd frontend && npx tsc --noEmit` runs clean (or errors are triaged and fixed).
- Implementation notes: Fixed. Set `strict: true`, fixed the two resulting errors (untyped `useState(null)` in `App.tsx`, possibly-null `document.getElementById('root')` in `main.tsx`). `npx tsc --noEmit` passes clean.

## Finding: No types in API client

- Location: `frontend/src/api/client.ts`
- Status: confirmed
- Evidence: `request(path, options?)` and all exported functions have no parameter/return types — everything is implicitly `any`.
- Impact: No compile-time safety on API responses; typos like `task.name` vs `task.title` slip through silently.
- Priority: Medium
- Proposed solution: Add `Task`/`Project` interfaces and type `request<T>` to return `Promise<T>`.
- Verification: `npx tsc --noEmit` with `strict: true` passes.
- Implementation notes: Fixed. Added `api/types.ts` (`Project`, `Task`, `User`, `TaskStatus`), typed `request<T>` and all exported functions in `client.ts`.

## Finding: Fetch errors not handled in API client

- Location: `frontend/src/api/client.ts:3-6`
- Status: confirmed
- Evidence: `request()` calls `res.json()` unconditionally, never checking `res.ok`. A 4xx/5xx response is parsed as if it were success (or throws an unhandled JSON-parse error).
- Impact: Backend errors crash the UI or fail silently instead of showing a useful message.
- Priority: High
- Proposed solution: Check `res.ok` and throw a descriptive error (or return a typed error result) before parsing JSON.
- Verification: Stop the backend or hit a 404/500 endpoint and confirm the UI shows an error instead of an unhandled exception.
- Implementation notes: Fixed. `request<T>` now checks `res.ok` and throws before parsing JSON. Verified: stopped the backend container and reloaded the app.

## Finding: No error handling when loading projects

- Location: `frontend/src/components/ProjectList.tsx:7-9`
- Status: confirmed
- Evidence: `getProjects().then(setProjects)` has no `.catch`.
- Impact: If the request fails, the sidebar just stays empty with no feedback to the user.
- Priority: Medium
- Proposed solution: Add `.catch` to set an error state and render a message/retry option.
- Verification: Stop the backend and confirm the UI shows an error instead of a silent empty list.
- Implementation notes: Fixed. Added `.catch` + error state in `ProjectList.tsx`, rendering "Failed to load projects." Verified live: with the backend stopped, the sidebar shows that message instead of staying blank.

## Finding: Task title never renders (field name mismatch)

- Location: `frontend/src/components/TaskItem.tsx:15`
- Status: confirmed (observed live)
- Evidence: Renders `{task.name}`, but the backend `Task` entity only has a `title` field (`backend/.../entity/Task.java:27`), so the JSON key is `title`, not `name`. Verified in-browser: every task card in the board shows no title text at all.
- Impact: Every task card shows a blank title — core feature looks broken.
- Priority: High
- Proposed solution: Render `task.title` instead of `task.name`.
- Verification: Reload a project's task board and confirm titles are visible.
- Implementation notes: Fixed. `TaskItem.tsx` now renders `task.title`. Verified live: task cards show real titles ("Design landing page", "Set up CI pipeline", etc.).

## Finding: Task list doesn't refresh when switching projects

- Location: `frontend/src/components/TaskBoard.tsx:8-12`
- Status: confirmed (observed live)
- Evidence: `useEffect(() => { getTasks(projectId)... }, [])` — empty dependency array, so it only fetches once on mount and never reruns when `projectId` changes. Verified in-browser: selecting "Mobile App" after "Website Redesign" left the board showing Website Redesign's 4 tasks (bob/carol/dave/alice) unchanged.
- Impact: Selecting a different project in the sidebar doesn't load that project's tasks; the board keeps showing the first-loaded project's tasks.
- Priority: High
- Proposed solution: Add `projectId` to the effect's dependency array.
- Verification: Select project A, then project B, and confirm the task list updates to B's tasks.
- Implementation notes: Fixed. Added `projectId` to the effect's dependency array. Verified live: switching from "Website Redesign" to "Mobile App" now correctly loads Mobile App's own 4 tasks.

## Finding: Toggling a task doesn't reliably re-render

- Location: `frontend/src/components/TaskBoard.tsx:14-19`
- Status: confirmed (observed live)
- Evidence: `handleToggle` mutates `task.status` directly, then calls `setTasks(tasks)` with the *same* array reference. React does a reference check on state and won't re-render. Verified in-browser: clicking "Complete" fired `PUT /api/tasks/5/status?status=DONE` → `200`, but the badge stayed on `TODO`. The mutated value only appeared after an unrelated re-render (switching projects) forced React to repaint — proving the write succeeded but the UI silently desynced until something else forced a repaint.
- Impact: Clicking "Complete"/"Reopen" doesn't reliably update the UI even though the PUT request fires.
- Priority: High
- Proposed solution: Build a new array instead of mutating in place, e.g. `setTasks(tasks.map(t => t.id === task.id ? { ...t, status: next } : t))`.
- Verification: Click "Complete" and confirm the badge updates immediately, no extra interaction needed.
- Implementation notes: Fixed. `handleToggle` now calls `setTasks(prev => prev.map(...))` with a new array instead of mutating in place. Verified live: clicking "Complete" flips the badge to `DONE`/"Reopen" instantly.

## Finding: List rendered with array index as key

- Location: `frontend/src/components/TaskBoard.tsx:29`
- Status: confirmed
- Evidence: `tasks.map((task, index) => <TaskItem key={index} ...>)` uses `index` instead of `task.id`.
- Impact: React can misattribute component state/DOM across rows when the list reorders or items are added/removed.
- Priority: Low
- Proposed solution: Use `key={task.id}`.
- Verification: n/a — code review confirms; no visible symptom with the current static list.
- Implementation notes: Fixed. `TaskBoard.tsx` now uses `key={task.id}`.

---

# Backend

## Finding: CORS wildcard on all controllers

- Location: `AuthController.java:14`, `ProjectController.java:16`, `TaskController.java:23`
- Status: confirmed
- Evidence: All three controllers use `@CrossOrigin(origins = "*")`.
- Impact: Any website can call this API from a browser with no origin restriction — combined with no auth checks on endpoints, this widens the attack surface unnecessarily.
- Priority: Medium
- Proposed solution: Replace with an explicit allowed-origin list (the frontend's origin), ideally centralized in one `WebMvcConfigurer` CORS bean instead of repeated per-controller.
- Verification: Requests from the allowed origin still work; requests from another origin are rejected (check `Access-Control-Allow-Origin` response header).
- Implementation notes: Fixed — centralized in `config/WebConfig.java`, `@CrossOrigin` removed from all controllers. Verified: request with `Origin: http://evil.example.com` gets no `Access-Control-Allow-Origin` header; `Origin: http://localhost:5173` does.

## Finding: Passwords stored and compared in plaintext

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java:33` (`user.getPassword().equals(password)`); `backend/src/main/resources/data.sql:1-7` seeds plaintext passwords.
- Status: confirmed
- Evidence: No hashing on register or login; `User.password` is stored and compared as raw text. No password-hashing library (e.g. Spring Security crypto) is on the classpath.
- Impact: Critical  a DB read exposes every user's real password.
- Priority: High
- Proposed solution: Add `spring-security-crypto`, hash on register with `BCryptPasswordEncoder.encode()`, compare on login with `.matches()`. Requires also replacing the plaintext seed passwords in `data.sql` with pre-computed BCrypt hashes of the same values so seeded logins keep working.
- Verification: Login with a seeded user (e.g. alice/password123) still succeeds after the change; DB column no longer contains readable passwords.
- Implementation notes: Deferred — touches a new dependency and the seed data together; revisit after the other fixes.

## Finding: Comment feature has no API endpoints

- Location: `backend/src/main/java/com/dexwin/taskflow/repository/CommentRepository.java`; no `CommentController` exists anywhere in `controller/`.
- Status: confirmed
- Evidence: `Comment` entity and `CommentRepository.findByTaskId` exist, and the README describes tasks as carrying comments, but there is no controller mapping any `/api/.../comments` route.
- Impact: Comments can never be created or read through the API even though the domain fully supports them — a documented feature is entirely missing.
- Priority: Medium
- Proposed solution: Add a `CommentController` with at least `GET /api/tasks/{id}/comments` and `POST /api/tasks/{id}/comments`.
- Verification: Hit the new endpoints and confirm comments seeded in `data.sql` are returned, and a new comment can be created.
- Implementation notes: Fixed — added `CommentController` (`GET`/`POST /api/tasks/{taskId}/comments`). Verified: seeded comments for task 1 are returned.

## Finding: No global exception handling — unhandled lookups return raw 500s

- Location: `TaskController.createTask` (project lookup), `TaskService.updateStatus` (task lookup), `AuthController.login` (user lookup) — all use `.orElseThrow()` with nothing catching it.
- Status: confirmed
- Evidence: No `@ControllerAdvice`/`@ExceptionHandler` exists anywhere in the backend.
- Impact: Requesting a nonexistent project/task/username returns a raw 500 with a stack trace instead of a proper 404/400 JSON error — leaks internals and gives the frontend nothing structured to handle.
- Priority: Medium
- Proposed solution: Add a `@ControllerAdvice` mapping `NoSuchElementException` → 404 (and similar) with a clean JSON error body.
- Verification: Request `/api/tasks/999999/status?status=DONE` (or similar) and confirm a 404 JSON response instead of a 500 stack trace.
- Implementation notes: Fixed — added `exception/ApiExceptionHandler.java` (`@RestControllerAdvice`) mapping `NoSuchElementException` → 404. Verified: `PUT /api/tasks/999999/status?status=DONE` now returns 404 with a JSON body instead of a 500 stack trace.

## Finding: TaskController mixes direct repository access with the service layer

- Location: `backend/src/main/java/com/dexwin/taskflow/controller/TaskController.java` — `getTasks` and `createTask` call `taskRepository`/`projectRepository` directly, while `getTaskSummaries`, `updateStatus`, and `search` go through `TaskService`.
- Status: confirmed
- Evidence: Controller depends on both the repositories and `TaskService`; business logic (attaching a project to a new task) sits in the controller for one endpoint but in the service for others.
- Impact: Inconsistent architecture — no single place owns task business rules, so future changes (validation, error handling, etc.) are easy to add on one path and miss on the other. Not a runtime bug, a maintainability risk.
- Priority: Low
- Proposed solution: Move `getTasks`/`createTask` logic into `TaskService`; have `TaskController` depend only on `TaskService`.
- Verification: `GET /api/projects/{id}/tasks` and `POST /api/projects/{id}/tasks` behave identically after the refactor.
- Implementation notes: Fixed — `getTasksForProject`/`createTask` moved into `TaskService`; `TaskController` now depends only on `TaskService`. Verified both endpoints still work.

## Finding: N+1 query problem in getTaskSummaries

- Location: `backend/src/main/java/com/dexwin/taskflow/service/TaskService.java:26-40` (`getTaskSummaries`)
- Status: confirmed (observed at runtime)
- Evidence: `Task.comments` is `@OneToMany` (default `LAZY`), so `task.getComments().size()` per task triggers a separate SQL query. Verified live with `show-sql` against `GET /api/projects/1/task-summaries` (4 tasks): **10 SQL selects** for one request — 1 for the task list, 1 shared project/owner lookup, then 4 separate per-task `assignee` selects and 4 separate per-task `comments` selects. So both the comments collection *and* the assignee lookup go N+1 in this codepath, not just comments as the static read suggested.
- Impact: Task-summary requests degrade linearly with task count — observed ~2N+2 queries for N tasks; a project with 100 tasks would fire ~200+ queries instead of 1-2.
- Priority: Medium
- Proposed solution: Replace the per-task entity loop with a single repository query returning id/title/status/assignee/comment-count directly (JPQL `LEFT JOIN` + `GROUP BY` via a projection interface), then build the response with `.stream().map(...)`.
- Verification: Enable `spring.jpa.show-sql=true`, hit `/api/projects/{id}/task-summaries` before/after, confirm query count drops from N+1 to 1.
- Implementation notes: Fixed added `TaskRepository.findTaskSummariesByProjectId` (single JPQL query, `LEFT JOIN` + `GROUP BY`, returned via a projection interface) and rewrote `TaskService.getTaskSummaries` to stream over it. Verified via logs: one request now issues exactly 1 SQL query instead of 10, and the response data (titles, assignees, comment counts) matches the seed data.

## Finding: No input validation on entities or controllers

- Location: `AuthController.register`, `ProjectController.create`, `TaskController.createTask` (all `@RequestBody` params); entity fields on `User`, `Task`, `Project`.
- Status: confirmed
- Evidence: `spring-boot-starter-validation` is a declared dependency (`pom.xml`) but never used — no `@Valid` on any controller param, no `@NotNull`/`@NotBlank`/`@Email`/`@Size` on any entity field.
- Impact: Endpoints accept blank/null usernames, passwords, task titles, etc. with no rejection — bad data reaches the DB, or throws unhandled DB constraint exceptions as raw 500s (compounds the missing-exception-handler finding).
- Priority: Medium
- Proposed solution: Add Bean Validation annotations to entity fields (`@NotBlank` on `title`/`username`/`name`, `@Email` on `email`, etc.) and `@Valid` on the `@RequestBody` params in controllers.
- Verification: POST with a missing/blank required field (e.g. register with blank username) and confirm a 400 validation error instead of a 500 or a silently-saved bad row.
- Implementation notes: Fixed — added `@NotBlank`/`@Email` to `User`/`Task`/`Project`/`Comment` fields, `@Valid` on all four `@RequestBody` controller params, and a `MethodArgumentNotValidException` handler in `ApiExceptionHandler` returning a clean 400 with field errors. Verified: `POST /api/projects/1/tasks` with `{"title":""}` returns 400 instead of saving a blank-title task.

## Finding: User.password serialized in every API response

- Location: `backend/src/main/java/com/dexwin/taskflow/entity/User.java` — `password` field has no `@JsonIgnore`.
- Status: confirmed (observed live)
- Evidence: `GET /api/tasks/{id}/comments` (and any endpoint returning a nested `User` — task assignee, project owner, comment author, register response) includes the raw `password` value in the JSON.
- Impact: Every user's password (currently plaintext; would be the hash after the deferred hashing fix) is exposed to any API caller. Independent of whether passwords are hashed  a hash shouldn't be serialized either.
- Priority: High
- Proposed solution: Add `@JsonProperty(access = WRITE_ONLY)` to `User.password` (not a plain `@JsonIgnore`, so `register`'s incoming JSON can still set it — only outgoing serialization is blocked).
- Verification: Hit `/api/tasks/1/comments` and confirm no `password` field appears in the response.
- Implementation notes: Fixed — added `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` on `User.password`. Verified: `/api/tasks/1/comments` no longer includes `password` anywhere in the nested JSON; login still works (server-side `getPassword()` unaffected).

## Finding: SQL injection in task search

- Location: `backend/src/main/java/com/dexwin/taskflow/service/TaskService.java:42-45`
- Status: confirmed
- Evidence: `q` is concatenated directly into a native SQL string (`"...WHERE title LIKE '%" + query + "%'"`) run via `entityManager.createNativeQuery`.
- Impact: Critical  any client can read/modify/destroy data via `GET /api/tasks/search?q=...`.
- Priority: High
- Proposed solution: Use a parameterized query (`@Query` with bind param, or `findByTitleContainingIgnoreCase`).
- Verification: Request `?q=' OR '1'='1` and confirm it no longer returns unrelated rows; normal search still works.
- Implementation notes: Fixed — replaced the native concatenated query with `TaskRepository.findByTitleContainingIgnoreCase` (safe derived query), removed unused `EntityManager`. Verified: payload `zzz' OR '1'='1' --` now returns `[]` instead of all 58 rows; normal search (`q=Design`) still returns the matching task.
