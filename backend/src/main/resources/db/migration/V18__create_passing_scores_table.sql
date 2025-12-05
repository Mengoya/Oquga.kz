CREATE TABLE passing_scores (
    id BIGSERIAL PRIMARY KEY,
    program_group_id BIGINT NOT NULL UNIQUE,
    min_score_grant INTEGER,
    min_score_paid INTEGER,
    profile_subjects VARCHAR(255),
    is_creative_exam BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ps_program_group FOREIGN KEY (program_group_id) REFERENCES educational_program_groups(id) ON DELETE CASCADE
);

CREATE INDEX idx_ps_program_group_id ON passing_scores(program_group_id);
