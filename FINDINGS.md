## Finding1: BASE_URL is not right, doen't inlcude hostname

- Location: client.ts
- Status: wasn't an issue
- Evidence: const BASE_URL = '/api';
- Impact: All api calls will not go through
- Priority: High
- Proposed solution: Verify and use right base urls
- Verification:
- Implementation notes:


## Finding1: Auth seems not to exist on frontend

- Location: Frontend
- Status: suspected
- Evidence:
- Impact: AP
- Priority: High
- Proposed solution: Verify and use right base urls
- Verification:
- Implementation notes:

## Finding1: Complete button works but user gets no feedback on the UI. There's no state transition of tasks on the UI

- Location: Frontend
- Status: solved
- Evidence:
- Impact: AP
- Priority: High
- Proposed solution: update dependecy array with tasks so it effect runs and update rendering
- Verification: Update is now reflected on screen reactively
- Implementation notes: