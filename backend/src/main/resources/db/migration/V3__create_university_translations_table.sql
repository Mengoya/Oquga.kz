CREATE TABLE university_translations (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    language_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    goal TEXT,
    address TEXT,
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ut_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT fk_ut_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    CONSTRAINT uq_ut_university_language UNIQUE (university_id, language_id)
);

CREATE INDEX idx_ut_university_id ON university_translations(university_id);
CREATE INDEX idx_ut_language_id ON university_translations(language_id);
