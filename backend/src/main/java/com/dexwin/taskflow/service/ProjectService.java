package com.dexwin.taskflow.service;

import com.dexwin.taskflow.dto.ProjectRequest;
import com.dexwin.taskflow.dto.ProjectResponse;
import com.dexwin.taskflow.entity.Project;
import com.dexwin.taskflow.entity.User;
import com.dexwin.taskflow.exception.ResourceNotFoundException;
import com.dexwin.taskflow.repository.ProjectRepository;
import com.dexwin.taskflow.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(owner);

        project = projectRepository.save(project);
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request, Long userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (!project.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to update this project");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        project = projectRepository.save(project);
        return toResponse(project);
    }

    @Transactional
    public void deleteProject(Long id, Long userId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        if (!project.getOwner().getId().equals(userId)) {
            throw new AccessDeniedException("You do not have permission to delete this project");
        }

        projectRepository.delete(project);
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setName(project.getName());
        response.setDescription(project.getDescription());
        if (project.getOwner() != null) {
            response.setOwnerId(project.getOwner().getId());
            response.setOwnerUsername(project.getOwner().getUsername());
        }
        return response;
    }
}
