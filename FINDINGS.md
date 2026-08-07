1.

Backend
JWT token
--login route
boolean ok = user.getPassword().equals(password);

Frontend
-No auth(login or register)

2. 
1. Not fetching a select task
2. Update a select task to complete(refresh the state)
3. Update status(TOdo->Inprogress->Done)
4. Add new task
5. login/register page
6. No search bar to search for task
7. Endpoint not implemented()


## Finding: Number 1 - No authentication

- Location: Backend
- Status: observed 
- Evidence: No middleware for authentication, if user has right to access a resource
- Impact: All task are available to anyone to access
- Priority: High
- Proposed solution: Add middleware for authentication
- Verification: No token
- Implementation notes: Add a JWT token authentication

## Finding: Number 1 - No authentication, saving data in plain text(password)

- Location: Backend
- Status: observed 
- Evidence: No middleware for authentication, if user has right to access a resource
- Impact: All task are available to anyone to access
- Priority: High
- Proposed solution: Add middleware for authentication
- Verification: No token
- Implementation notes: Add a JWT token authentication

## Finding: Number 2 - Using Boolen for password checking

- Location: Backend(controller: Authcontroller)
- Status: observed 
- Evidence: boolean ok = user.getPassword().equals(password);
- Impact: 
- Priority: High
- Proposed solution: Add middleware for authentication
- Verification: No token
- Implementation notes: Add a JWT token authentication