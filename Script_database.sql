CREATE DATABASE IF NOT EXISTS countries_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE countries_db;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(2) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO products (name, country, sku) VALUES
('Producto México', 'MX', 'CT-MX-1'),
('Producto USA', 'US', 'CT-US-2'),
('Producto Canadá', 'CA', 'CT-CA-3');