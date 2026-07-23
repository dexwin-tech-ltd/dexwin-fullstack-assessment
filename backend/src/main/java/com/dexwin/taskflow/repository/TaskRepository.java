package com.dexwin.taskflow.repository;

import com.dexwin.taskflow.entity.Task;
import com.dexwin.taskflow.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT t.id AS id, t.title AS title, t.status AS status, "
            + "a.username AS assigneeUsername, COUNT(c) AS commentCount "
            + "FROM Task t LEFT JOIN t.assignee a LEFT JOIN t.comments c "
            + "WHERE t.project.id = :projectId "
            + "GROUP BY t.id, t.title, t.status, a.username")
    List<TaskSummaryProjection> findTaskSummariesByProjectId(@Param("projectId") Long projectId);

    interface TaskSummaryProjection {
        Long getId();
        String getTitle();
        TaskStatus getStatus();
        
        String getAssigneeUsername();
        Long getCommentCount();
    }
}
