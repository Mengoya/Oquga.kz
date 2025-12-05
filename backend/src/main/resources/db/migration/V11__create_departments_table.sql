CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    photo BYTEA,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dep_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

CREATE INDEX idx_dep_faculty_id ON departments(faculty_id);
