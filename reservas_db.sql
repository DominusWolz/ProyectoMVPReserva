-- 1. Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS reservas_db;
USE reservas_db;

-- 2. Crear la tabla de Usuarios
DROP TABLE IF EXISTS `Usuario`; 
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- 3. Crear la tabla de Mesas
DROP TABLE IF EXISTS `mesas`; 
CREATE TABLE IF NOT EXISTS mesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  capacidad INT NOT NULL
);


DROP TABLE IF EXISTS `servicios`; 
CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  duracion INT NOT NULL COMMENT 'Duración en minutos',
  precio DECIMAL(10, 2) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

DROP TABLE IF EXISTS `reservas`; 
CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(255) NOT NULL,
  fecha_hora DATETIME NOT NULL,
  mesa_id INT NOT NULL,
  servicio_id INT NOT NULL, -- <--- Conexión con el servicio
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  CONSTRAINT fk_reserva_mesa 
    FOREIGN KEY (mesa_id) REFERENCES mesas(id) 
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reserva_servicio 
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) 
    ON UPDATE CASCADE ON DELETE RESTRICT
);
INSERT INTO servicios (nombre, duracion, precio, createdAt, updatedAt) VALUES 
('Mesa Estándar', 120, 0.00, NOW(), NOW()),
('Cena de Aniversario', 180, 15000.00, NOW(), NOW()),
('Salón Privado VIP', 240, 50000.00, NOW(), NOW());
