CREATE TABLE international_items (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    external_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ii_section FOREIGN KEY (section_id) REFERENCES international_sections(id) ON DELETE CASCADE
);

CREATE INDEX idx_ii_section_id ON international_items(section_id);
