Location: ProjectList.tsx
Status: observed
Evidence: onClick={() => onSelect(project.id)}
Solution: it will be a good practice to declare a function and place the the Onselect(project.id)

Location: TaskBoard.tsx
Status: Observed
Evidence:  updateTaskStatus(task.id, next);
Solution: Created a function, and placed the updateTaskStatus in, then i call the function name, to keep the code clean and reusable

Location: TaskItem.tsx
Status: Observed
Evidence:  {priority ? priority.label : 'P' + task.priority}
Proposed Solution: Enscapsulated the code, to make it clean, best practice
          

Location: ProjectList.tsx
Status: Observed
Evidence: useEffect(() => {
    getProjects().then(setProjects);
  }, []);
Proposed solution: Added a dependence, so that useEffects runs after every evidence happens on that particular dependecy
Location: Web design
Status: Observed
Evidence, Complete button not working as expected, toggle issue not working, for instance i am unable to toggle on to do, medium, bob, same for the other toggles, and buttons

Location: UI
Status: Observed
Evidence: Not responsive on other devices

Location UI
Status: observed
Evidence: the page is static, without any interactivity

Location: UI
Status: Observed

