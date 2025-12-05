CREATE TABLE educational_programs (
    id BIGSERIAL PRIMARY KEY,
    program_group_id BIGINT NOT NULL,
    code VARCHAR(20) NOT NULL,
    photo BYTEA,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ep_program_group FOREIGN KEY (program_group_id) REFERENCES educational_program_groups(id) ON DELETE CASCADE
);

CREATE INDEX idx_ep_program_group_id ON educational_programs(program_group_id);
CREATE INDEX idx_ep_code ON educational_programs(code);
