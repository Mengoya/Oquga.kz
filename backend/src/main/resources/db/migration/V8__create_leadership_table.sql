CREATE TABLE leadership (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio_summary TEXT,
    photo BYTEA,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lead_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_lead_university_id ON leadership(university_id);
