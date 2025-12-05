CREATE TABLE achievements (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    year INTEGER,
    rank_value VARCHAR(100),
    details TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ach_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_ach_university_id ON achievements(university_id);
CREATE INDEX idx_ach_year ON achievements(year);
