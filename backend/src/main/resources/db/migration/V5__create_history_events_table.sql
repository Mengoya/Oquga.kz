CREATE TABLE history_events (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    event_year INTEGER NOT NULL,
    event_description TEXT,
    photo BYTEA,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_he_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_he_university_id ON history_events(university_id);
CREATE INDEX idx_he_event_year ON history_events(event_year);
