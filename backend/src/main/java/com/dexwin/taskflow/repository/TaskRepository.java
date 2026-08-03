package com.dexwin.taskflow.repository;

import com.dexwin.taskflow.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);
    
    List<Task> findByTitleContainingIgnoreCase(String title);
}
