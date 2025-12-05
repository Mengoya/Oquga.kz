CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    university_id BIGINT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_users_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);