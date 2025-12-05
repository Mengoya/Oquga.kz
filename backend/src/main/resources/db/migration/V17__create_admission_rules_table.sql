CREATE TABLE admission_rules (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL UNIQUE,
    start_date DATE,
    end_date DATE,
    documents_text TEXT,
    steps_text TEXT,
    military_department_info TEXT,
    dormitory_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ar_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_ar_university_id ON admission_rules(university_id);