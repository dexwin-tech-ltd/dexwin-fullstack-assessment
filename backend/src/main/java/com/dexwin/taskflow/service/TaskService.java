package com.dexwin.taskflow.service;

import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.entity.TaskStatus;
import com.dexwin.taskflow.repository.TaskRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Map<String, Object>> getTaskSummaries(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        List<Map<String, Object>> summaries = new ArrayList<>();
        for (Task task : tasks) {
            Map<String, Object> summary = new HashMap<>();
            summary.put("id", task.getId());
            summary.put("title", task.getTitle());
            summary.put("status", task.getStatus());
            // Pull related data per task as we build the response.
            summary.put("assignee", task.getAssignee() != null ? task.getAssignee().getUsername() : null);
            summary.put("commentCount", task.getComments().size());
            summaries.add(summary);
        }
        return summaries; // refactor this code
    }

    public List<Task> search(String query) {
        String sql = "SELECT * FROM tasks WHERE title LIKE '%" + query + "%'";
        return entityManager.createNativeQuery(sql, Task.class).getResultList(); // inserting directly.. use repository layer ->
        //use the injected repository method
    }

    public Task updateStatus(Long taskId, TaskStatus status) { // wrap in transaction
        Task task = taskRepository.findById(taskId).orElseThrow(); // through explict exceptions
        task.setStatus(status);
        return taskRepository.save(task); // can be merged as one and c
    }
}
