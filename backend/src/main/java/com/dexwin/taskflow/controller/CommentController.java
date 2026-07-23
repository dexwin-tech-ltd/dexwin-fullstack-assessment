package com.dexwin.taskflow.controller;

import com.dexwin.taskflow.entity.Comment;
import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.repository.CommentRepository;
import com.dexwin.taskflow.repository.TaskRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;

    public CommentController(CommentRepository commentRepository, TaskRepository taskRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
    }

    @GetMapping
    public List<Comment> getComments(@PathVariable Long taskId) {
        return commentRepository.findByTaskId(taskId);
    }

    @PostMapping
    public Comment addComment(@PathVariable Long taskId, @Valid @RequestBody Comment comment) {
        Task task = taskRepository.findById(taskId).orElseThrow();
        comment.setTask(task);
        return commentRepository.save(comment);
    }
}
