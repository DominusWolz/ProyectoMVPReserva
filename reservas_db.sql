-- 1. Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS reservas_db;
USE reservas_db;

-- 2. Crear la tabla de Usuarios
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
CREATE TABLE IF NOT EXISTS mesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  capacidad INT NOT NULL
);

-- 4. Crear la tabla de Reservas
CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(255) NOT NULL,
  fecha_hora DATETIME NOT NULL,
  mesa_id INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  CONSTRAINT fk_reserva_mesa 
    FOREIGN KEY (mesa_id) 
    REFERENCES mesas(id) 
    ON UPDATE CASCADE 
    ON DELETE RESTRICT
);