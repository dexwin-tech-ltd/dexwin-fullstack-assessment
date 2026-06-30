package com.dexwin.taskflow.controller;

import com.dexwin.taskflow.entity.Project;
import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.entity.TaskPriority;
import com.dexwin.taskflow.entity.TaskStatus;
import com.dexwin.taskflow.repository.ProjectRepository;
import com.dexwin.taskflow.repository.TaskRepository;
import com.dexwin.taskflow.service.TaskService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TaskService taskService;

    public TaskController(TaskRepository taskRepository,
                          ProjectRepository projectRepository,
                          TaskService taskService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.taskService = taskService;
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getTasks(@PathVariable UUID projectId,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return this.taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/projects/{projectId}/task-summaries")
    public List<Map<String, Object>> getTaskSummaries(@PathVariable UUID projectId) {
        return this.taskService.getTaskSummaries(projectId);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public Task createTask(@PathVariable UUID projectId, @RequestBody Task task) {
        Project project = this.projectRepository.findById(projectId).orElseThrow();
        task.setProject(project);
        return this.taskRepository.save(task);
    }

    @PutMapping("/tasks/{id}/status")
    public Task updateStatus(@PathVariable UUID id, @RequestParam TaskStatus status) {
        return this.taskService.updateStatus(id, status);
    }

    @GetMapping("/tasks/search")
    public List<Task> search(@RequestParam String q) {
        return this.taskService.search(q);
    }

    @GetMapping("/tasks/priorities")
    public List<Map<String, String>> getPriorities() {
        return Arrays.stream(TaskPriority.values())
            .map(priority -> Map.of(
                "value", priority.name(),
                "label", priority.name().charAt(0) + priority.name().substring(1).toLowerCase()
            ))
            .collect(Collectors.toList());
    }
}
