CREATE TABLE international_section_translations (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    language_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ist_section FOREIGN KEY (section_id) REFERENCES international_sections(id) ON DELETE CASCADE,
    CONSTRAINT fk_ist_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    CONSTRAINT uq_ist_section_language UNIQUE (section_id, language_id)
);

CREATE INDEX idx_ist_section_id ON international_section_translations(section_id);
CREATE INDEX idx_ist_language_id ON international_section_translations(language_id);
