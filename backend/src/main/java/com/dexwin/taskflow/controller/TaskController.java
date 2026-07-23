package com.dexwin.taskflow.controller;

import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.entity.TaskStatus;
import com.dexwin.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/projects/{projectId}/tasks")
    public List<Task> getTasks(@PathVariable Long projectId,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        return taskService.getTasksForProject(projectId);
    }

    @GetMapping("/projects/{projectId}/task-summaries")
    public List<Map<String, Object>> getTaskSummaries(@PathVariable Long projectId) {
        return taskService.getTaskSummaries(projectId);
    }

    @PostMapping("/projects/{projectId}/tasks")
    public Task createTask(@PathVariable Long projectId, @Valid @RequestBody Task task) {
        return taskService.createTask(projectId, task);
    }

    @PutMapping("/tasks/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        return taskService.updateStatus(id, status);
    }

    @GetMapping("/tasks/search")
    public List<Task> search(@RequestParam String q) {
        return taskService.search(q);
    }
}
