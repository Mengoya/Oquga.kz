CREATE TABLE faculty_translations (
    id BIGSERIAL PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    language_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ft_faculty FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    CONSTRAINT fk_ft_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    CONSTRAINT uq_ft_faculty_language UNIQUE (faculty_id, language_id)
);

CREATE INDEX idx_ft_faculty_id ON faculty_translations(faculty_id);
CREATE INDEX idx_ft_language_id ON faculty_translations(language_id);
