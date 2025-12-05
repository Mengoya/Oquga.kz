CREATE TABLE educational_program_translations (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT NOT NULL,
    language_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ept_program FOREIGN KEY (program_id) REFERENCES educational_programs(id) ON DELETE CASCADE,
    CONSTRAINT fk_ept_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    CONSTRAINT uq_ept_program_language UNIQUE (program_id, language_id)
);

CREATE INDEX idx_ept_program_id ON educational_program_translations(program_id);
CREATE INDEX idx_ept_language_id ON educational_program_translations(language_id);
