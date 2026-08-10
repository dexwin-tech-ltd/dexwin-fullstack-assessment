

setTask in handleToggle is mutating the object directly, need to create a new object instead

tasklist maps using index which isnt reliable, we should use the id reference in the object if there is one
<div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={handleToggle} />
        ))}
      </div>

setTask in Taskboard needs to be changed as it replaces the old object

The onToggle button needs to take an Id and not the full task object

The useEffect only mounts once and doesnt re-render when we want to filter or chnage projects
So a dependency array had to be created such that when the project ID changes, the useEffect is trigeered and re-renders the update list
 useEffect(() => {
    getTasks(projectId).then((data) => {
      setTasks(data);
    });
  }, [projectId]);


<!-- Thinking of adding a useEffect to handleToggle so it can rerender when the toggle status changes -->