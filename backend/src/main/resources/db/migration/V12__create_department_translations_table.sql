CREATE TABLE department_translations (
    id BIGSERIAL PRIMARY KEY,
    department_id BIGINT NOT NULL,
    language_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    mission TEXT,
    tasks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dt_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT fk_dt_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    CONSTRAINT uq_dt_department_language UNIQUE (department_id, language_id)
);

CREATE INDEX idx_dt_department_id ON department_translations(department_id);
CREATE INDEX idx_dt_language_id ON department_translations(language_id);
