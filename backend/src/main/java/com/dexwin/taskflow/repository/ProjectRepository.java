package com.dexwin.taskflow.repository;

import com.dexwin.taskflow.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
}
