CREATE TABLE educational_program_groups (
    id BIGSERIAL PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    department_id BIGINT,
    degree_level VARCHAR(20) NOT NULL,
    code VARCHAR(20) NOT NULL,
    photo BYTEA,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_epg_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    CONSTRAINT fk_epg_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT chk_degree_level CHECK (degree_level IN ('BACHELOR', 'MASTER', 'DOCTORATE'))
);

CREATE INDEX idx_epg_faculty_id ON educational_program_groups(faculty_id);
CREATE INDEX idx_epg_department_id ON educational_program_groups(department_id);
CREATE INDEX idx_epg_degree_level ON educational_program_groups(degree_level);
