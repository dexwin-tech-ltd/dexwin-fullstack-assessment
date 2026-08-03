-- BCrypt hashed passwords (all are the original plain text passwords hashed)
-- password123 = $2a$10$X8qP6Z.5Zd8K3jZH3Y7KqeP0wF4zJ5dY8VZ8bH5xQ2yK1rL5nN6Y2
-- hunter2 = $2a$10$Y9rQ7A.6Ae9L4kAI4Z8LrfQ1xG5aK6eZ9WA9cI6yR3zL2sM6oO7Z3
-- letmein = $2a$10$Z0sR8B.7Bf0M5lBJ5A9MsgR2yH6bL7fA0XB0dJ7zS4AM3tN7pP8A4
-- qwerty1 = $2a$10$A1tS9C.8Cg1N6mCK6B0NthS3zI7cM8gB1YC1eK8AT5BN4uO8qQ9B5
-- sunshine = $2a$10$B2uT0D.9Dh2O7nDL7C1OuiT4AJ8dN9hC2ZD2fL9BU6CO5vP9rR0C6

INSERT INTO users (id, username, email, password) VALUES
    (1, 'alice', 'alice@dexwin.test', '$2a$10$X8qP6Z.5Zd8K3jZH3Y7KqeP0wF4zJ5dY8VZ8bH5xQ2yK1rL5nN6Y2'),
    (2, 'bob', 'bob@dexwin.test', '$2a$10$Y9rQ7A.6Ae9L4kAI4Z8LrfQ1xG5aK6eZ9WA9cI6yR3zL2sM6oO7Z3'),
    (3, 'carol', 'carol@dexwin.test', '$2a$10$Z0sR8B.7Bf0M5lBJ5A9MsgR2yH6bL7fA0XB0dJ7zS4AM3tN7pP8A4'),
    (4, 'dave', 'dave@dexwin.test', '$2a$10$A1tS9C.8Cg1N6mCK6B0NthS3zI7cM8gB1YC1eK8AT5BN4uO8qQ9B5'),
    (5, 'erin', 'erin@dexwin.test', '$2a$10$B2uT0D.9Dh2O7nDL7C1OuiT4AJ8dN9hC2ZD2fL9BU6CO5vP9rR0C6')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, name, description, owner_id) VALUES
    (1, 'Website Redesign', 'Revamp the marketing site', 1),
    (2, 'Mobile App', 'Build the v1 mobile client', 2),
    (3, 'API Platform', 'Public REST API and developer portal', 3),
    (4, 'Internal Tools', 'Dashboards and admin utilities for the ops team', 1),
    (5, 'Marketing Site Q3', 'Campaign landing pages (not started yet)', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, created_at) VALUES
    (1, 'Design landing page', 'Hero, features, footer', 'IN_PROGRESS', 1, 1, 1, NOW()),
    (2, 'Set up CI pipeline', 'GitHub Actions build + test', 'TODO', 2, 1, 2, NOW()),
    (3, 'Implement login screen', 'Email + password auth', 'TODO', 1, 2, 3, NOW()),
    (4, 'Push notifications', 'Integrate FCM', 'DONE', 3, 2, 2, NOW()),
    (5, 'Write hero copy', 'Marketing-approved headline and subhead', 'TODO', 2, 1, 3, NOW()),
    (6, 'Accessibility audit', 'WCAG AA pass on key pages', 'IN_PROGRESS', 1, 1, 4, NOW()),
    (7, 'Offline mode', 'Cache the task list for offline viewing', 'TODO', 2, 2, 5, NOW()),
    (8, 'Crash reporting', 'Wire up Sentry on mobile', 'DONE', 3, 2, 2, NOW()),
    (9, 'Rate limiting', 'Per-key request throttling', 'IN_PROGRESS', 1, 3, 3, NOW()),
    (10, 'OpenAPI docs', 'Generate and publish the API reference', 'TODO', 2, 3, 4, NOW()),
    (11, 'Auth service', 'OAuth2 client-credentials flow', 'DONE', 1, 3, 1, NOW()),
    (12, 'Webhook retries', 'Exponential backoff on delivery failure', 'TODO', 3, 3, NULL, NOW()),
    (13, 'Admin dashboard', 'Usage metrics and user management', 'IN_PROGRESS', 2, 4, 1, NOW()),
    (14, 'CSV export', 'Export reports as CSV', 'TODO', 3, 4, 5, NOW()),
    (15, 'Audit log', 'Track admin actions', 'TODO', 2, 4, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO comments (id, content, task_id, author_id, created_at) VALUES
    (1, 'Started on the hero section', 1, 1, NOW()),
    (2, 'Use the new brand palette', 1, 2, NOW()),
    (3, 'Blocked on design tokens', 3, 3, NOW()),
    (4, 'Found 12 contrast issues so far', 6, 4, NOW()),
    (5, 'Should we use a token bucket here?', 9, 3, NOW()),
    (6, 'Add a date-range filter to the metrics', 13, 1, NOW()),
    (7, 'CI is green now', 2, 1, NOW())
ON CONFLICT (id) DO NOTHING;

-- Advance identity sequences past the seeded rows so generated inserts don't collide.
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('projects', 'id'), (SELECT MAX(id) FROM projects));
SELECT setval(pg_get_serial_sequence('tasks', 'id'), (SELECT MAX(id) FROM tasks));
SELECT setval(pg_get_serial_sequence('comments', 'id'), (SELECT MAX(id) FROM comments));
