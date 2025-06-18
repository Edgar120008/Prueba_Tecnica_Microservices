CREATE DATABASE countries_db;

USE countries_db;

CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

INSERT INTO countries (name, sku) VALUES
('Mexico', 'CT-ME-1'),
('Canada', 'CT-CA-2'),
('Brazil', 'CT-BR-3');
