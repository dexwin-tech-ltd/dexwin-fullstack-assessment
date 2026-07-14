# TaskFlow

A small task & project management application: a **React** frontend backed by a **Spring Boot** REST API and **PostgreSQL**.

Users own projects, projects contain tasks, tasks are assigned to users and can carry comments. The frontend lets you browse projects and toggle task completion.

---

## The assessment

This codebase **works in places and is broken in others**. It was written quickly and never reviewed. Your job is to act as the engineer who picks it up during a one-hour live session.

Work through these stages in order and keep `FINDINGS.md` current throughout:

1. **Review the source before running it.** Create `FINDINGS.md` and record every issue or material risk you identify from reading the code.
2. **Run and investigate the application.** Add every runtime issue you observe to `FINDINGS.md`. Clearly distinguish observed behaviour from suspicions that still need verification.
3. **Propose solutions before implementing.** For every finding, record its likely impact, priority, proposed solution, and how you would verify the result. You may explicitly defer lower-priority work.
4. **Implement the highest-priority fixes.** Make focused, idiomatic changes and verify both the fixes and likely regressions.

You may use AI in the final step of this session. You own every finding and change. 
Keep your AI interaction visible, give it bounded context, review its output carefully, prevent unrelated changes, and verify everything you accept. 
We assess how well you direct and review AI—not how much code it can generate.

We care more about how you reason and prioritise than about catching every last item. Call out anything you would do with more time.

> There is no fixed bug count given to you on purpose. Treat it like a real codebase.

### Suggested `FINDINGS.md` format

Use this structure for each finding, or an equivalent structure containing the same evidence:

```markdown
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

---

## Tech stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 18 + Vite             |
| Backend  | Spring Boot 3, Spring Data JPA |
| Database | PostgreSQL 16               |

## Prerequisites

Pick whichever fits what you have installed:

- **Run everything in Docker (recommended):** just **Docker** (Docker Desktop or equivalent). Nothing else required.
- **Run locally:** **Java 17+** (JDK), **Node 18+** with npm, and **PostgreSQL 16** (or use Docker for just the database).

## Running it — Option 1: everything in Docker (one command)

```bash
docker compose up
```

This builds and starts all three services together — PostgreSQL, the Spring Boot backend, and the React frontend. The first run downloads dependencies and may take a few minutes; later runs are fast.

Once it's up:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **Database:** runs inside the Compose network (not exposed on your host, so it won't clash with any Postgres you already run).

Your source is mounted into the containers, so you can edit and see changes:

- **Frontend changes hot-reload automatically** (Vite HMR).
- **Backend (Java) changes:** run `docker compose restart backend` to pick them up (Spring recompiles on start). Reliable auto-reload for Java across Docker's file sharing is flaky, so a quick restart is the dependable path.

Stop with `Ctrl-C`, or `docker compose down` (add `-v` to also wipe the database).

## Running it — Option 2: locally (without Docker for the app)

### 1. Start PostgreSQL — pick ONE

**A. Docker, database only:**

```bash
docker compose up -d db
```

Or **B. a local PostgreSQL** — create the role and database the app expects:

```bash
createuser taskflow --pwprompt        # set the password to: taskflow
createdb taskflow --owner taskflow
```

…or from `psql` as a superuser:

```sql
CREATE USER taskflow WITH PASSWORD 'taskflow';
CREATE DATABASE taskflow OWNER taskflow;
```

The backend reads its connection from `backend/src/main/resources/application.yml`
(`jdbc:postgresql://localhost:5432/taskflow`, user/password `taskflow`/`taskflow`). To point at a
different host/port/credentials without editing that file, set the standard Spring env vars, e.g.:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/taskflow ./mvnw spring-boot:run
```

> Note: Option 2's local-DB step expects Postgres on the host's port `5432`. The Docker-only-DB
> variant above (`docker compose up -d db`) does **not** publish a host port (the full stack talks to it
> internally), so if you want to connect a locally-run backend to the Dockerised DB, publish a port for
> it or use Option 1.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run   (Maven users: mvn spring-boot:run)
```

The API comes up on `http://localhost:8080`. On first start the schema is created and seed data is loaded automatically — no manual migration step.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app is served at `http://localhost:5173`. It calls the backend at `http://localhost:8080` (configured in `frontend/src/api/client.js`).

### Troubleshooting

- **Reset the database:** `docker compose down -v` then bring it back up.
- **Backend can't connect (local run):** make sure PostgreSQL is running and reachable *before* starting the backend.
- **Ports 8080 / 5173 already in use:** stop whatever is using them (or a previous run of this app) first.

## API overview

| Method | Path                                   | Description                  |
|--------|----------------------------------------|------------------------------|
| GET    | `/api/projects`                        | List all projects            |
| GET    | `/api/projects/{id}`                   | Get a single project         |
| POST   | `/api/projects`                        | Create a project             |
| GET    | `/api/projects/{id}/tasks`             | List tasks in a project      |
| GET    | `/api/projects/{id}/task-summaries`    | Lightweight task summaries   |
| POST   | `/api/projects/{id}/tasks`             | Create a task                |
| PUT    | `/api/tasks/{id}/status?status=DONE`   | Update a task's status       |
| GET    | `/api/tasks/search?q=...`              | Search tasks by title        |
| POST   | `/api/auth/register`                   | Register a user              |
| POST   | `/api/auth/login`                      | Log in                       |

## Seeded accounts

| Username | Password      |
|----------|---------------|
| alice    | password123   |
| bob      | hunter2       |
| carol    | letmein       |
| dave     | qwerty1       |
| erin     | sunshine      |

## Deliverable

A branch or archive containing your fixes and final `FINDINGS.md`. Be prepared to explain the evidence you gathered, how you prioritised the findings, how you directed and reviewed AI, how you verified the changes, and what you would do next. Good luck!
