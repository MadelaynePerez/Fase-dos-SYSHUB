
CREATE DATABASE Syshub;
USE Syshub;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (nombre) VALUES 
('Estudiante'),
('Auxiliar'),
('Administrador');

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_rol INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);
select * from usuarios;

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE proyectos (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    archivo VARCHAR(255),
    stack_tecnologico VARCHAR(150),
    destacado BOOLEAN DEFAULT FALSE,
    id_usuario INT,
    id_categoria INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE foros (
    id_foro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    id_usuario INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    contenido TEXT NOT NULL,
    id_usuario INT,
    id_foro INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_foro) REFERENCES foros(id_foro) ON DELETE CASCADE
);

CREATE TABLE articulos (
    id_articulo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(50),
    id_usuario INT,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE votos (
    id_voto INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('proyecto','foro','articulo'),
    id_referencia INT,
    id_usuario INT,
    valor INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
select * from usuarios;
select * from proyectos;
INSERT INTO usuarios (nombre, email, password, id_rol)
VALUES ('Ana', 'ana@test.com', '123456', 1);

ALTER TABLE votos 
ADD UNIQUE KEY unique_voto (tipo, id_referencia, id_usuario);

DELETE FROM usuarios WHERE email = 'ana@test.com';

select * from usuarios;

UPDATE usuarios SET id_rol = 2 WHERE email = 'isma@gmail.com';

ALTER TABLE proyectos ADD COLUMN tags VARCHAR(255);
ALTER TABLE usuarios ADD COLUMN suspendido BOOLEAN DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN bio TEXT;

CREATE TABLE denuncias (
  id_denuncia INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('proyecto','foro','usuario') NOT NULL,
  id_referencia INT NOT NULL,
  id_usuario INT,
  motivo TEXT NOT NULL,
  estado ENUM('pendiente','revisada','resuelta') DEFAULT 'pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

INSERT INTO categorias (nombre) VALUES 
('Estructuras de Datos'),
('Sistemas Operativos'),
('Bases de Datos'),
('Compiladores'),
('Redes'),
('Inteligencia Artificial'),
('Desarrollo Web'),
('Infraestructura'),
('Otros');