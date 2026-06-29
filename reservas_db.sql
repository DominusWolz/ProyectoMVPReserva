CREATE DATABASE IF NOT EXISTS reservas_db;
USE reservas_db;

DROP TABLE IF EXISTS `reservas`;
DROP TABLE IF EXISTS `disponibilidades`;
DROP TABLE IF EXISTS `servicios`;
DROP TABLE IF EXISTS `mesas`;
DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin') NOT NULL DEFAULT 'cliente',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE mesas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero INT NOT NULL UNIQUE,
  capacidad INT NOT NULL
);

CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  duracion INT NOT NULL COMMENT 'Duracion en minutos',
  precio DECIMAL(10, 2) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE disponibilidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dia_semana INT NOT NULL COMMENT '1=Domingo ... 7=Sabado',
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  intervalo_min INT NOT NULL DEFAULT 60,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  mesa_id INT NOT NULL,
  servicio_id INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL DEFAULT 'confirmada',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reserva_mesa FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reserva_servicio FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT INTO usuarios (nombre, email, password, rol, createdAt, updatedAt) VALUES
('Admin', 'admin@restaurant.com', '$2a$10$placeholder', 'admin', NOW(), NOW());

INSERT INTO mesas (numero, capacidad) VALUES
(1, 2), (2, 4), (3, 4), (4, 6), (5, 8);

INSERT INTO servicios (nombre, duracion, precio, createdAt, updatedAt) VALUES 
('Mesa Estandar', 120, 0.00, NOW(), NOW()),
('Cena de Aniversario', 180, 15000.00, NOW(), NOW()),
('Salon Privado VIP', 240, 50000.00, NOW(), NOW());
