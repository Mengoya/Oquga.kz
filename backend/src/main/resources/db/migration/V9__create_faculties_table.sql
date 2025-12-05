CREATE TABLE faculties (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    photo BYTEA,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fac_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_fac_university_id ON faculties(university_id);
