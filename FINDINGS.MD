# TaskFlow Application - Findings & Fixes

## Finding 1: SQL Injection Vulnerability in Task Search

- **Location**: `backend/src/main/java/com/dexwin/taskflow/service/TaskService.java` (line 43)
- **Status**: confirmed | fixed
- **Evidence**: String concatenation in native SQL query: `"SELECT * FROM tasks WHERE title LIKE '%" + query + "%'"`
- **Impact**: CRITICAL - Allows arbitrary SQL execution, database compromise, data theft
- **Priority**: P0 - Must fix immediately
- **Proposed solution**: Use parameterized query with `@Query` annotation or JPA Specification
- **Verification**: Test with malicious input like `'; DROP TABLE tasks; --`
- **Implementation notes**: Replace with `findByTitleContainingIgnoreCase` repository method

## Finding 2: No Authentication/Authorization System

- **Location**: `backend/src/main/java/com/dexwin/taskflow/controller/AuthController.java`
- **Status**: confirmed | fixed
- **Evidence**: Login returns boolean, no JWT tokens, no session management, no Spring Security
- **Impact**: CRITICAL - Anyone can access/modify any resource without authentication
- **Priority**: P0 - Must fix immediately
- **Proposed solution**: Implement Spring Security with JWT authentication, role-based access control
- **Verification**: Verify protected endpoints return 401/403 without valid token
- **Implementation notes**: Add Spring Security + JWT dependencies, SecurityConfig, JwtTokenProvider, AuthenticationFilter

## Finding 3: Plain Text Password Storage

- **Location**: `backend/src/main/java/com/dexwin/taskflow/entity/User.java` & `AuthController.java`
- **Status**: confirmed | fixed
- **Evidence**: Passwords stored and compared as plain text: `user.getPassword().equals(password)`
- **Impact**: CRITICAL - Database breach exposes all user passwords
- **Priority**: P0 - Must fix immediately
- **Proposed solution**: Use BCryptPasswordEncoder for hashing/verification
- **Verification**: Check database - password column should contain bcrypt hashes starting with $2a$
- **Implementation notes**: Hash on registration, verify with BCrypt on login, rehash seed data

## Finding 4: CORS Origins Wildcard

- **Location**: All controllers (`@CrossOrigin(origins = "*")`)
- **Status**: confirmed | fixed
- **Evidence**: `@CrossOrigin(origins = "*")` on AuthController, ProjectController, TaskController
- **Impact**: HIGH - Allows malicious sites to make authenticated requests from user browsers
- **Priority**: P1 - Fix in security implementation
- **Proposed solution**: Configure specific allowed origins in Spring Security CORS config
- **Verification**: Verify requests from disallowed origins are blocked
- **Implementation notes**: Use WebMvcConfigurer with specific origins list

## Finding 5: TaskBoard useEffect Missing Dependency

- **Location**: `frontend/src/components/TaskBoard.tsx` (line 12)
- **Status**: confirmed | fixed
- **Evidence**: `useEffect(..., [])` - empty dependency array doesn't include `projectId`
- **Impact**: HIGH - Tasks don't reload when user switches projects
- **Priority**: P1 - Critical UX bug
- **Proposed solution**: Add `projectId` to dependency array
- **Verification**: Switch between projects, verify task list updates
- **Implementation notes**: Change to `useEffect(..., [projectId])`

## Finding 6: Task Status Update State Mutation Bug

- **Location**: `frontend/src/components/TaskBoard.tsx` (line 16-19)
- **Status**: confirmed | fixed
- **Evidence**: `task.status = next; setTasks(tasks)` - mutates object then sets same array reference
- **Impact**: HIGH - UI doesn't update after toggling task status
- **Priority**: P1 - Critical UX bug
- **Proposed solution**: Create new array with updated task object (immutable update)
- **Verification**: Click Complete/Reopen button, verify task status updates visually
- **Implementation notes**: Use `setTasks(tasks.map(t => t.id === task.id ? {...t, status: next} : t))`

## Finding 7: Task Property Name Mismatch

- **Location**: `frontend/src/components/TaskItem.tsx` (line 14)
- **Status**: confirmed | fixed
- **Evidence**: Component displays `task.name` but backend sends `task.title`
- **Impact**: HIGH - Task titles don't display (shows undefined)
- **Priority**: P1 - Critical display bug
- **Proposed solution**: Change `task.name` to `task.title` in TaskItem
- **Verification**: Check that task titles are visible in the UI
- **Implementation notes**: Simple find/replace in TaskItem.tsx

## Finding 8: API Client Has No Error Handling

- **Location**: `frontend/src/api/client.ts`
- **Status**: confirmed | fixed
- **Evidence**: No try/catch, no status code checks, assumes all requests succeed
- **Impact**: MEDIUM - App crashes on network errors or 4xx/5xx responses
- **Priority**: P2 - Add error handling
- **Proposed solution**: Check response.ok, throw errors with proper messages
- **Verification**: Test with backend down, verify error messages display
- **Implementation notes**: Add status check and error throwing in request() function

## Finding 9: ProjectList useEffect Missing Error Handling

- **Location**: `frontend/src/components/ProjectList.tsx` (line 8)
- **Status**: confirmed | fixed
- **Evidence**: `getProjects().then(setProjects)` - no .catch() for errors
- **Impact**: MEDIUM - Errors are silently swallowed, no user feedback
- **Priority**: P2 - Add error handling
- **Proposed solution**: Add .catch() with error state and display
- **Verification**: Test with backend down, verify error message displays
- **Implementation notes**: Add error state and catch handler

## Finding 10: Lazy Loading Not Configured for Relationships

- **Location**: `backend/src/main/java/com/dexwin/taskflow/entity/Task.java` & `Project.java`
- **Status**: confirmed | fixed
- **Evidence**: ManyToOne relationships (assignee, owner) return null because of lazy loading
- **Impact**: MEDIUM - Assignee names and owner info don't display in frontend
- **Priority**: P2 - Fix entity relationships
- **Proposed solution**: Use DTOs with explicit data fetching, or add @EntityGraph
- **Verification**: Verify assignee names display in task list
- **Implementation notes**: Create DTOs and convert entities to DTOs in service layer

## Finding 11: No Global Exception Handler

- **Location**: Backend (missing `@ControllerAdvice` class)
- **Status**: confirmed | fixed
- **Evidence**: Controllers return null or throw uncaught exceptions
- **Impact**: MEDIUM - Poor error messages, security info leakage in stack traces
- **Priority**: P2 - Add global exception handler
- **Proposed solution**: Create @ControllerAdvice with @ExceptionHandler methods
- **Verification**: Test invalid requests, verify proper error responses
- **Implementation notes**: Create GlobalExceptionHandler with handlers for common exceptions

## Finding 12: No Input Validation

- **Location**: All controller methods accepting @RequestBody
- **Status**: confirmed | fixed
- **Evidence**: No @Valid annotation, no validation constraints on entities
- **Impact**: MEDIUM - Can create invalid data (null names, invalid emails, etc.)
- **Priority**: P2 - Add validation
- **Proposed solution**: Add @Valid annotations and Jakarta validation constraints
- **Verification**: Test with invalid data, verify 400 responses with error messages
- **Implementation notes**: Add @NotNull, @NotBlank, @Email, @Size to entity fields

## Finding 13: Missing Service Layer for Projects and Users

- **Location**: Backend (only TaskService exists)
- **Status**: confirmed | fixed
- **Evidence**: Controllers call repositories directly, no business logic layer
- **Impact**: LOW - Poor separation of concerns, harder to add business logic
- **Priority**: P2 - Add service layer
- **Proposed solution**: Create ProjectService, UserService, AuthService
- **Verification**: Controllers should call services, not repositories
- **Implementation notes**: Move business logic from controllers to services

## Finding 14: No DTO Layer

- **Location**: Backend (entities exposed directly via REST)
- **Status**: confirmed | fixed
- **Evidence**: Controllers return/accept entity classes directly
- **Impact**: MEDIUM - Can't control serialization, tight coupling, security risks
- **Priority**: P2 - Add DTOs
- **Proposed solution**: Create request/response DTOs for all endpoints
- **Verification**: Entities should not be exposed in controller signatures
- **Implementation notes**: Create DTO classes and MapStruct mappers

## Finding 15: Missing CRUD Operations

- **Location**: All controllers
- **Status**: confirmed | fixed
- **Evidence**: No UPDATE or DELETE endpoints for projects/tasks, no Comment endpoints at all
- **Impact**: MEDIUM - Users can't edit or delete resources
- **Priority**: P2 - Complete CRUD operations
- **Proposed solution**: Add PUT/DELETE endpoints for projects and tasks, full CRUD for comments
- **Verification**: Test all CRUD operations via API
- **Implementation notes**: Add controller methods with proper authorization checks

## Finding 16: Task Key in TaskBoard Uses Index

- **Location**: `frontend/src/components/TaskBoard.tsx` (line 27)
- **Status**: confirmed | fixed
- **Evidence**: `key={index}` instead of `key={task.id}`
- **Impact**: LOW - React reconciliation issues when list order changes
- **Priority**: P3 - React best practice
- **Proposed solution**: Use `key={task.id}`
- **Verification**: No console warnings about keys
- **Implementation notes**: Simple change in map function

## Finding 17: No Loading States in Frontend

- **Location**: All frontend components fetching data
- **Status**: confirmed | fixed
- **Evidence**: No loading indicators while fetching data
- **Impact**: LOW - Poor UX, users don't know if app is working
- **Priority**: P3 - UX improvement
- **Proposed solution**: Add loading state and spinner component
- **Verification**: Verify spinner shows during data fetch
- **Implementation notes**: Add isLoading state and conditional rendering

## Finding 18: No TypeScript Types for API Data

- **Location**: `frontend/src/api/client.ts` and all components
- **Status**: confirmed | fixed
- **Evidence**: No interfaces defined for Project, Task, User types
- **Impact**: LOW - No type safety, harder to catch bugs
- **Priority**: P3 - Code quality
- **Proposed solution**: Define TypeScript interfaces for all data models
- **Verification**: TypeScript compiler should catch type errors
- **Implementation notes**: Create types.ts with all interfaces

## Finding 19: No Authorization Checks on Resources

- **Location**: All backend controllers
- **Status**: confirmed | fixed
- **Evidence**: No checks if user owns project before modification, anyone can modify anything
- **Impact**: CRITICAL - Users can modify/delete other users' data
- **Priority**: P0 - Must fix with authentication
- **Proposed solution**: Add ownership checks in service layer before operations
- **Verification**: Test that user A cannot modify user B's projects/tasks
- **Implementation notes**: Check @AuthenticationPrincipal against resource owner

## Finding 20: Environment-Specific Configuration Not Externalized

- **Location**: `application.yml` has hardcoded credentials
- **Status**: confirmed | fixed
- **Evidence**: Database credentials hardcoded in application.yml
- **Impact**: MEDIUM - Credentials in source control, can't change per environment
- **Priority**: P2 - Security best practice
- **Proposed solution**: Use environment variables for sensitive config
- **Verification**: App should read from env vars, not hardcoded values
- **Implementation notes**: Use ${DB_PASSWORD:default} syntax in application.yml

---

## Summary

**CRITICAL (P0)**: 4 issues - SQL Injection, No Auth, Plain Text Passwords, No Authorization
**HIGH (P1)**: 3 issues - CORS, Frontend state bugs  
**MEDIUM (P2)**: 9 issues - Error handling, validation, architecture improvements
**LOW (P3)**: 4 issues - UX and code quality improvements

**Total**: 20 findings

