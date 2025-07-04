-- Insert sample users
INSERT INTO users (id, email, password) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', '$2a$10$rOzJqZxjdebZxQzgQqQqQeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J'),
    ('550e8400-e29b-41d4-a716-446655440002', 'jane@example.com', '$2a$10$rOzJqZxjdebZxQzgQqQqQeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J'),
    ('550e8400-e29b-41d4-a716-446655440003', 'bob@example.com', '$2a$10$rOzJqZxjdebZxQzgQqQqQeJ1J1J1J1J1J1J1J1J1J1J1J1J1J1J1J')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, name, owner_id) VALUES 
    ('660e8400-e29b-41d4-a716-446655440001', 'Website Redesign', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (id) DO NOTHING;

-- Insert sample memberships
INSERT INTO memberships (user_id, project_id) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001'),
    ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002'),
    ('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002')
ON CONFLICT (user_id, project_id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, status, project_id, assignee_id) VALUES 
    ('Design Homepage', 'Create wireframes and mockups for the new homepage', 'todo', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
    ('Setup Database', 'Configure PostgreSQL database and create initial schema', 'in-progress', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
    ('User Authentication', 'Implement login and registration functionality', 'done', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001'),
    ('API Development', 'Create REST API endpoints for mobile app', 'todo', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002'),
    ('UI Components', 'Build reusable UI components', 'in-progress', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT (id) DO NOTHING;
