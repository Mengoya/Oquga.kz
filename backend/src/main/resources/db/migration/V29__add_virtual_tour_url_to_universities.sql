ALTER TABLE universities ADD COLUMN virtual_tour_url VARCHAR(500);

COMMENT ON COLUMN universities.virtual_tour_url IS 'Ссылка на 3D тур или панораму университета';