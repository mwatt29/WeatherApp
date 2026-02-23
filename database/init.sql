CREATE TABLE weather_records (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    average_temperature DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Index for faster location queries
CREATE INDEX idx_location ON weather_records(location);
