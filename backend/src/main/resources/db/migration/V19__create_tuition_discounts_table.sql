CREATE TABLE tuition_discounts (
    id BIGSERIAL PRIMARY KEY,
    university_id BIGINT NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    price_per_year INTEGER,
    scholarship_info TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_td_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_td_university_id ON tuition_discounts(university_id);
