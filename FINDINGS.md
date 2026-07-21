# Errors with the frontend -  ProjectList


1. No error handling on the fetch — line 8: getProjects().then(setProjects) has no .catch. Worse, request() in client.ts calls res.json() unconditionally with no res.ok check. So on a 4xx/5xx that returns an error object (e.g. { detail: "..." }), setProjects gets a non-array and projects.map throws, crashing the component.

2. setState after unmount / race condition — lines 7-9: if the component unmounts before the promise resolves, setProjects runs on an unmounted component. Use an ignore/AbortController cleanup in the effect.

3. No loading state — there's no way to distinguish "still fetching" from "no projects." The list just renders empty until data arrives.

4. Untyped props — line 4: { selectedProjectId, onSelect } are implicitly any. Should be a typed props interface (selectedProjectId: string | null, onSelect: (id: string) => void).

5. useState([]) infers never[] — line 5: with no type argument the state is typed never[], so project in the map is never. Under strict typing, setProjects(actualObjects) is a type error, and project.id/.name/.description aren't type-checked at all. Add a Project type: useState<Project[]>([]).

6. api/client.ts params are also untyped — path, projectId, status, task are all implicit any.

# Errors with the frontend -  TaskBoard

# Bugs (these cause visible broken behavior)
1. Toggling a task does nothing on screen — lines 16-17: task.status = next; setTasks(tasks) mutates the existing task object and then passes the same array reference back to setTasks. React bails out of re-rendering when the reference is unchanged, so the card never updates until something else forces a render. This is the core bug — state must be updated immutably.

2. Tasks don't refetch when the project changes — line 12: the effect uses projectId but has an empty dependency array []. Selecting a different project in the list won't reload its tasks. Should be [projectId].

3. key={index} — line 29: using the array index as the key. Use task.id — index keys cause wrong DOM reuse/state bleed when the list reorders or items are added/removed.

Robustness
4. No error handling + setState after unmount — lines 9-11: no .catch, and if getTasks returns a non-array (error payload from the res.ok-less request() in client.ts), tasks.map / tasks.length break. Also no cleanup guard, so a resolve after unmount sets state on a dead component.

5. Optimistic update with no rollback — line 18: updateTaskStatus isn't awaited and has no error handling. If the server call fails, the UI silently diverges from the backend.

TypeScript
6. Untyped props / never[] state — line 5-6: projectId is implicit any, and useState([]) infers never[], so nothing about task is type-checked. Same untyped-props issue in TaskItem.tsx.


# Errors with the frontend -  TaskItem

1. PRIORITY lookup can miss due to string/number key coercion — lines 1-5, 10: the object literal keys 1/2/3 become the strings "1"/"2"/"3". task.priority from a JSON API is a number, so PRIORITY[task.priority] works via JS coercion — but it's fragile. If the API ever sends priority as a string, or a value outside 1–3, priority is undefined. The code does guard for that on line 21 (priority ? ... : 'P' + task.priority), so it degrades rather than crashes — but the typing (below) should nail this down.

2. priority != null vs falsy — line 20: task.priority != null is correct here (renders even for 0), good — but note PRIORITY[0] would be undefined so it'd render P0. Fine as a fallback, just confirm the backend never sends 0.

3. TypeScript (nothing is typed in this .tsx)
Untyped props — line 7: { task, onToggle } are implicit any. No type safety on task.status, task.priority, task.assignee.username, etc.

4. PRIORITY has no type — indexing with an arbitrary number isn't checked; a typed record makes the lookup safe.

5. Minor / robustness
task.assignee.username — line 25: guarded by task.assignee &&, so safe, but if assignee exists without username it renders empty. Acceptable.

6. No type="button" on the toggle button — line 28: if this card is ever rendered inside a <form>, a button without an explicit type defaults to submit and could trigger form submission. Add type="button".


# Bugs at the APP.tsx
useState(null) infers type null — line 6: with no type argument, selectedProjectId is typed null and setSelectedProjectId only accepts null. So onSelect={setSelectedProjectId} passed into ProjectList (which calls onSelect(project.id) with a string) is a type error under strict typing, and projectId={selectedProjectId} can never actually be a string as far as TS knows.

fix: const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);


# ROOT CAUSE — "Data not populating on the frontend"

The projects list loaded, but selecting a project showed `Tasks 0` / blank cards. The backend API was healthy the whole time — the bug was on the frontend.

1. **Field-name mismatch: backend `title` vs frontend `name`** (the main bug).
   The backend `Task` entity exposes the field as `title` (`Task.java:27`, confirmed in the JSON: `{"id":9,"title":"Rate limiting",...}`), but `TaskItem` rendered `task.name` — always `undefined` — so every task card had a blank title.
   - Fix: renamed the frontend `Task.name` → `Task.title` and render `{task.title}` in `TaskItem.tsx`.

2. **Duplicate, drifted `Task` interface.**
   `TaskBoard.tsx` declared its own local `Task` interface separate from the one in `TaskItem.tsx`; they disagreed (`name` vs `title`, `id: string` vs number), which is how the mismatch slipped through type-checking.
   - Fix: deleted the duplicate and made `TaskBoard` import the single canonical `Task` from `TaskItem.tsx`. `id` corrected to `number` to match the API.

3. **Tasks didn't refetch when switching projects.**
   `TaskBoard`'s effect used `projectId` but had an empty dependency array `[]`, so only the first selected project ever loaded.
   - Fix: dependency array changed to `[projectId]`, plus a cleanup guard against setState-after-unmount and a `.catch`.


# api/client.ts

- **`request()` never checks `res.ok`** — it calls `res.json()` unconditionally, so an HTTP error returns an error object instead of throwing. Callers then feed a non-array to `.map`/`.length`. Recommended: check `res.ok` and throw on failure so the components' `.catch` handlers fire. (Front-end components were hardened with `Array.isArray(...)` guards and `.catch` as an interim safety net.)


# INFRASTRUCTURE / DEVOPS

1. **Maven build failure — truncated dependency download.**
   `dependency:go-offline` in `backend/Dockerfile.dev` failed with `Premature end of Content-Length delimited message body` on `net.bytebuddy:byte-buddy` — Maven Central dropped the connection mid-download. Transient; the `.m2` cache lives in the build layer (not a host volume) and failed `RUN` layers aren't cached, so a clean rebuild recovers.
   - Recommended hardening: add wagon retry flags to the `go-offline` command
     (`-Dmaven.wagon.http.retryHandler.count=5 -Dmaven.wagon.httpconnectionManager.ttlSeconds=60 -Dmaven.wagon.http.pool=false`).

2. **Vite proxy `ECONNREFUSED` on `/api/*`.**
   The frontend was up and proxying before Spring Boot had bound port 8080, so early `/api` calls were refused. Root cause: the frontend only waited for the backend *container to start*, not for the app to be *ready*.

3. **Backend healthcheck pointed at a non-existent endpoint → frontend never started.**
   The healthcheck probed `/actuator/health`, but there's no actuator dependency in `pom.xml`, so it returned **404** and the backend stayed `unhealthy`. With the frontend gated on `depends_on: backend: condition: service_healthy`, the frontend container never came up.
   - Fix: point the healthcheck at a real endpoint that returns 200 — `curl -sf http://localhost:8080/api/projects`. Also fixed a YAML indentation slip under the frontend's `depends_on`. `curl` is present in the base image and a `start_period: 90s` gives Spring Boot time to boot.
   - After the fix: backend reports `healthy`, the frontend starts, and `/api/projects` + `/api/projects/{id}/tasks` proxy through `:5173` with HTTP 200.


# RESOLUTION SUMMARY

| # | Area | Issue | Status |
|---|------|-------|--------|
| 1 | TaskItem/TaskBoard | `title` vs `name` field mismatch (blank tasks) | ✅ Fixed |
| 2 | TaskBoard | Duplicate/drifted `Task` interface | ✅ Fixed (shared type) |
| 3 | TaskBoard | Effect deps `[]` — no refetch on project switch | ✅ Fixed (`[projectId]`) |
| 4 | TaskBoard | Direct mutation + same array ref — toggle didn't re-render | ✅ Fixed (immutable update) |
| 5 | TaskBoard | `key={index}` | ✅ Fixed (`key={task.id}`) |
| 6 | TaskBoard | No error handling / rollback on toggle | ✅ Fixed (catch + optimistic rollback) |
| 7 | TaskItem | `.replace('_', ' ')` replaced only first underscore | ✅ Fixed (`/_/g`) |
| 8 | TaskItem | Untyped props, `type="button"`, empty assignee chip | ✅ Fixed |
| 9 | ProjectList/App | Untyped `useState` / props (`never[]`, `null`) | ✅ Fixed (typed) |
| 10 | ProjectList/TaskBoard | No fetch error handling / setState-after-unmount | ✅ Fixed (catch + cleanup) |
| 11 | api/client.ts | `request()` doesn't check `res.ok` | ⚠️ Recommended (guards added client-side) |
| 12 | docker-compose | Healthcheck hit non-existent `/actuator/health` (404) → frontend blocked | ✅ Fixed (`/api/projects`) |
| 13 | Dockerfile.dev | Maven truncated download (byte-buddy) | ℹ️ Transient; retry flags recommended |


the frontend could not backend 

Confirmed the root cause. The backend Task entity field is title (Task.java:27), and the JSON confirms it ("title":"Rate limiting"). But the frontend Task type and TaskItem render task.name — which is always undefined. So task cards render with blank titles.

There are also two type mismatches: task id is a number in the API (not string), and TaskBoard keeps its own duplicate Task interface that drifted from TaskItem's — which is exactly how the name/title mismatch slips through. Let me fix all of it.

First, TaskItem — the field is title, id is a number, and export the canonical type:




