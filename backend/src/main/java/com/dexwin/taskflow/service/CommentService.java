package com.dexwin.taskflow.service;

import com.dexwin.taskflow.dto.CommentRequest;
import com.dexwin.taskflow.dto.CommentResponse;
import com.dexwin.taskflow.entity.Comment;
import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.entity.User;
import com.dexwin.taskflow.exception.ResourceNotFoundException;
import com.dexwin.taskflow.repository.CommentRepository;
import com.dexwin.taskflow.repository.TaskRepository;
import com.dexwin.taskflow.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, TaskRepository taskRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public List<CommentResponse> getCommentsByTask(Long taskId) {
        return commentRepository.findByTaskId(taskId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse createComment(Long taskId, CommentRequest request, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTask(task);
        comment.setAuthor(author);

        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest request, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to update this comment");
        }

        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Allow both comment author and project owner to delete comments
        boolean isAuthor = comment.getAuthor().getId().equals(userId);
        boolean isProjectOwner = comment.getTask().getProject().getOwner().getId().equals(userId);

        if (!isAuthor && !isProjectOwner) {
            throw new AccessDeniedException("You do not have permission to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());

        if (comment.getTask() != null) {
            response.setTaskId(comment.getTask().getId());
        }

        if (comment.getAuthor() != null) {
            response.setAuthorId(comment.getAuthor().getId());
            response.setAuthorUsername(comment.getAuthor().getUsername());
        }

        return response;
    }
}
