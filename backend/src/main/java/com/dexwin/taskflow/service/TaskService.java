package com.dexwin.taskflow.service;

import com.dexwin.taskflow.entity.Project;
import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.entity.TaskStatus;
import com.dexwin.taskflow.repository.ProjectRepository;
import com.dexwin.taskflow.repository.TaskRepository;
import com.dexwin.taskflow.repository.TaskRepository.TaskSummaryProjection;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public List<Task> getTasksForProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task createTask(Long projectId, Task task) {
        Project project = projectRepository.findById(projectId).orElseThrow();
        task.setProject(project);
        return taskRepository.save(task);
    }

    public List<Map<String, Object>> getTaskSummaries(Long projectId) {
        return taskRepository.findTaskSummariesByProjectId(projectId).stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    private Map<String, Object> toSummary(TaskSummaryProjection p) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", p.getId());
        summary.put("title", p.getTitle());
        summary.put("status", p.getStatus());
        summary.put("assignee", p.getAssigneeUsername());
        summary.put("commentCount", p.getCommentCount());
        return summary;
    }

    public List<Task> search(String query) {
        return taskRepository.findByTitleContainingIgnoreCase(query);
    }

    public Task updateStatus(Long taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        task.setStatus(status);
        return taskRepository.save(task);
    }
}
