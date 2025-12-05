CREATE TABLE languages (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    native_name VARCHAR(50) NOT NULL,
    sort_order SERIAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO languages (code, name, native_name) VALUES
('kk', 'Kazakh', 'Қазақша'),
('ru', 'Russian', 'Русский'),
('en', 'English', 'English');
