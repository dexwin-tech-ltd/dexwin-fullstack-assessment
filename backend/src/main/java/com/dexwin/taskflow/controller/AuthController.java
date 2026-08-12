package com.dexwin.taskflow.controller;

import com.dexwin.taskflow.entity.User;
import com.dexwin.taskflow.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.http.HttpStatus;
import org.springframework.web.Server.ResponseStatus;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://didactic-space-journey-pww6pv7wwppcqwx-5173.app.github.dev/")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        User user = userRepository.findByUsername(username).orElseThrow();
        if(!user.getPassword().equals(password)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect Crendentials")
        }
        return Map.Of("userId", user.getgetId(),"username",user.getUsername());
    }
}
