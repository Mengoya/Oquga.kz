CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
    ('MAIN_ADMIN', 'Главный администратор системы'),
    ('UNIVERSITY_ADMIN', 'Администратор университета'),
    ('STUDENT', 'Студент');