## Prop Drilling

Location: frontend/src/App.jsx
Location: frontend/src/components/TaskBoard.jsx

Proposed solution: Use state management. it is none negotiable

Priority: High

Impact: Though not excessive, users will have to run through a couple files to get to the destination

Status: Confirmed

## Task ID:

Location: frontend/src/components/TaskBoard.jsx
Status: Confirmed
Impact: possible task item duplicate

Priority: Low
Proposed solution: use id of the item

## Absence of loader

Location: frontend/src/components/ProjectList.jsx
Status: Confirmed
Impact: Users does not know what is happening, list just pops up in their face
Priority: High
Proposed solution: add loader




1. Prop drilling in app.js file - I would use
2. I don't see the modeling being used any where
3. how do i know if the request function fails
4. Use id of the task intead of the index
5. if there is a server error, how do we know?
