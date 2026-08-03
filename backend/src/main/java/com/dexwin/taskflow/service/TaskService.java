package com.dexwin.taskflow.service;

import com.dexwin.taskflow.dto.TaskRequest;
import com.dexwin.taskflow.dto.TaskResponse;
import com.dexwin.taskflow.entity.Project;
import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.entity.TaskStatus;
import com.dexwin.taskflow.entity.User;
import com.dexwin.taskflow.exception.ResourceNotFoundException;
import com.dexwin.taskflow.repository.ProjectRepository;
import com.dexwin.taskflow.repository.TaskRepository;
import com.dexwin.taskflow.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getTaskSummaries(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        List<Map<String, Object>> summaries = new ArrayList<>();
        for (Task task : tasks) {
            Map<String, Object> summary = new HashMap<>();
            summary.put("id", task.getId());
            summary.put("title", task.getTitle());
            summary.put("status", task.getStatus());
            summary.put("priority", task.getPriority());
            if (task.getAssignee() != null) {
                Map<String, Object> assignee = new HashMap<>();
                assignee.put("id", task.getAssignee().getId());
                assignee.put("username", task.getAssignee().getUsername());
                summary.put("assignee", assignee);
            } else {
                summary.put("assignee", null);
            }
            summary.put("commentCount", task.getComments().size());
            summaries.add(summary);
        }
        return summaries;
    }

    public List<TaskResponse> search(String query) {
        // Fixed SQL injection - using JPA repository method
        List<Task> tasks = taskRepository.findByTitleContainingIgnoreCase(query);
        return tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(Long projectId, TaskRequest request, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        // Check if user has access to create tasks in this project
        if (!project.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to create tasks in this project");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority());
        task.setProject(project);

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        // Check if user owns the project
        if (!task.getProject().getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to update this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : task.getStatus());
        task.setPriority(request.getPriority());

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Transactional
    public TaskResponse updateStatus(Long taskId, TaskStatus status, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        // Allow both project owner and task assignee to update status
        boolean isOwner = task.getProject().getOwner().getId().equals(userId);
        boolean isAssignee = task.getAssignee() != null && task.getAssignee().getId().equals(userId);

        if (!isOwner && !isAssignee) {
            throw new AccessDeniedException("You do not have permission to update this task status");
        }

        task.setStatus(status);
        task = taskRepository.save(task);
        return toResponse(task);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        if (!task.getProject().getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to delete this task");
        }

        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setCreatedAt(task.getCreatedAt());

        if (task.getProject() != null) {
            response.setProjectId(task.getProject().getId());
            response.setProjectName(task.getProject().getName());
        }

        if (task.getAssignee() != null) {
            response.setAssigneeId(task.getAssignee().getId());
            response.setAssigneeUsername(task.getAssignee().getUsername());
        }

        response.setCommentCount(task.getComments().size());
        return response;
    }
}

