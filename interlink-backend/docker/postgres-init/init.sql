-- Initial database setup for Interlink Backend
-- This file is executed when PostgreSQL container starts

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create development user (optional)
-- CREATE USER interlink_dev WITH PASSWORD 'dev_password';
-- GRANT ALL PRIVILEGES ON DATABASE interlink TO interlink_dev;