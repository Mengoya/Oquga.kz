CREATE TABLE international_sections (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    external_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_is_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_is_university_id ON international_sections(university_id);
CREATE INDEX idx_is_sort_order ON international_sections(sort_order);
