CREATE TABLE international_item_translations (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL,
    language_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_iit_item FOREIGN KEY (item_id) REFERENCES international_items(id) ON DELETE CASCADE,
    CONSTRAINT fk_iit_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
    CONSTRAINT uq_iit_item_language UNIQUE (item_id, language_id)
);

CREATE INDEX idx_iit_item_id ON international_item_translations(item_id);
CREATE INDEX idx_iit_language_id ON international_item_translations(language_id);
