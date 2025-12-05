CREATE TABLE educational_program_group_translations (
    id BIGSERIAL PRIMARY KEY,
    program_group_id BIGINT NOT NULL,
    language_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_epgt_program_group FOREIGN KEY (program_group_id) REFERENCES educational_program_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_epgt_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    CONSTRAINT uq_epgt_program_group_language UNIQUE (program_group_id, language_id)
);

CREATE INDEX idx_epgt_program_group_id ON educational_program_group_translations(program_group_id);
CREATE INDEX idx_epgt_language_id ON educational_program_group_translations(language_id);
