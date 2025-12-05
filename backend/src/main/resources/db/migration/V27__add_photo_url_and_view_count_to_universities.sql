ALTER TABLE universities ADD COLUMN photo_url VARCHAR(500);
ALTER TABLE universities ADD COLUMN view_count BIGINT DEFAULT 0 NOT NULL;

CREATE INDEX idx_universities_view_count ON universities(view_count DESC);
