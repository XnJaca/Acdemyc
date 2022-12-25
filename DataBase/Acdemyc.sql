SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `usuario`;
DROP TABLE IF EXISTS `institucion`;
DROP TABLE IF EXISTS `administrador`;
DROP TABLE IF EXISTS `profesor`;
DROP TABLE IF EXISTS `estudiante`;
DROP TABLE IF EXISTS `asignatura`;
DROP TABLE IF EXISTS `encargado`;
DROP TABLE IF EXISTS `encargado_x_estudiante`;
DROP TABLE IF EXISTS `asignatura_x_profesor`;
DROP TABLE IF EXISTS `rol_administrador`;
DROP TABLE IF EXISTS `seccion`;
DROP TABLE IF EXISTS `matricula`;
DROP TABLE IF EXISTS `periodo_lectivo`;
DROP TABLE IF EXISTS `grado`;
DROP TABLE IF EXISTS `tipo_institucion`;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `usuario` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `cedula` VARCHAR(20) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `apellidos` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `clave` VARCHAR(500) NOT NULL,
    `telefono` VARCHAR(15) NOT NULL,
    `celular` VARCHAR(15),
    `direccion` TEXT NOT NULL,
    `fk_institucion` BIGINT NOT NULL,
    `estado` TINYINT NOT NULL,
    `google` TEXT,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `institucion` (
    `id` BIGINT AUTO_INCREMENT NOT NULL COMMENT 'podria ser de otro tipo. Esta tabla es para tenerla en cuenta y hacer la app multiple institucion',
    `nombre` VARCHAR(250) NOT NULL,
    `cedula` VARCHAR(20) NOT NULL,
    `direccion` TEXT NOT NULL,
    `fk_tipo_institucion` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `administrador` (
    `fk_usuario` BIGINT NOT NULL,
    `fk_rol_administrador` BIGINT NOT NULL,
    PRIMARY KEY (`fk_usuario`)
) ENGINE=InnoDB;

CREATE TABLE `profesor` (
    `fk_usuario` BIGINT NOT NULL,
    PRIMARY KEY (`fk_usuario`)
) ENGINE=InnoDB;

CREATE TABLE `estudiante` (
    `fk_usuario` BIGINT NOT NULL,
    PRIMARY KEY (`fk_usuario`)
) ENGINE=InnoDB;

CREATE TABLE `asignatura` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `codigo` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `encargado` (
    `fk_usuario` BIGINT NOT NULL,
    PRIMARY KEY (`fk_usuario`)
) ENGINE=InnoDB;

CREATE TABLE `encargado_x_estudiante` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `fk_estudiante` BIGINT NOT NULL,
    `fk_encargado` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `asignatura_x_profesor` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `fk_profesor` BIGINT NOT NULL,
    `fk_asignatura` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `rol_administrador` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `descripcion` VARCHAR(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB COMMENT='podrian ser por institucion';

CREATE TABLE `seccion` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `no_seccion` CHAR(2) NOT NULL,
    `fk_grado` BIGINT NOT NULL,
    `periodo_lectivo` BIGINT NOT NULL,
    `fk_institucion` BIGINT NOT NULL,
    `cantidad_estudiantes` INTEGER NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `matricula` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `fecha` DATETIME NOT NULL,
    `fk_institucion` BIGINT NOT NULL,
    `fk_estudiante` BIGINT NOT NULL,
    `fk_administrador` BIGINT NOT NULL,
    `fk_seccion` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `periodo_lectivo` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `ano` CHAR(4) NOT NULL,
    `fk_institucion` BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`ano`)
) ENGINE=InnoDB;

CREATE TABLE `grado` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `no_grado` CHAR(1) NOT NULL,
    `fk_institucion` BIGINT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `tipo_institucion` (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `descripcion` VARCHAR(250) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

ALTER TABLE `usuario` ADD FOREIGN KEY (`fk_institucion`) REFERENCES `institucion`(`id`);
ALTER TABLE `institucion` ADD FOREIGN KEY (`fk_tipo_institucion`) REFERENCES `tipo_institucion`(`id`);
ALTER TABLE `administrador` ADD FOREIGN KEY (`fk_usuario`) REFERENCES `usuario`(`id`);
ALTER TABLE `administrador` ADD FOREIGN KEY (`fk_rol_administrador`) REFERENCES `rol_administrador`(`id`);
ALTER TABLE `profesor` ADD FOREIGN KEY (`fk_usuario`) REFERENCES `usuario`(`id`);
ALTER TABLE `estudiante` ADD FOREIGN KEY (`fk_usuario`) REFERENCES `usuario`(`id`);
ALTER TABLE `encargado` ADD FOREIGN KEY (`fk_usuario`) REFERENCES `usuario`(`id`);
ALTER TABLE `encargado_x_estudiante` ADD FOREIGN KEY (`fk_estudiante`) REFERENCES `estudiante`(`fk_usuario`);
ALTER TABLE `encargado_x_estudiante` ADD FOREIGN KEY (`fk_encargado`) REFERENCES `encargado`(`fk_usuario`);
ALTER TABLE `asignatura_x_profesor` ADD FOREIGN KEY (`fk_profesor`) REFERENCES `profesor`(`fk_usuario`);
ALTER TABLE `asignatura_x_profesor` ADD FOREIGN KEY (`fk_asignatura`) REFERENCES `asignatura`(`id`);
ALTER TABLE `seccion` ADD FOREIGN KEY (`fk_institucion`) REFERENCES `institucion`(`id`);
ALTER TABLE `seccion` ADD FOREIGN KEY (`periodo_lectivo`) REFERENCES `periodo_lectivo`(`id`);
ALTER TABLE `seccion` ADD FOREIGN KEY (`fk_grado`) REFERENCES `grado`(`id`);
ALTER TABLE `matricula` ADD FOREIGN KEY (`fk_institucion`) REFERENCES `institucion`(`id`);
ALTER TABLE `matricula` ADD FOREIGN KEY (`fk_administrador`) REFERENCES `administrador`(`fk_usuario`);
ALTER TABLE `matricula` ADD FOREIGN KEY (`fk_estudiante`) REFERENCES `estudiante`(`fk_usuario`);
ALTER TABLE `matricula` ADD FOREIGN KEY (`fk_seccion`) REFERENCES `seccion`(`id`);
ALTER TABLE `periodo_lectivo` ADD FOREIGN KEY (`fk_institucion`) REFERENCES `institucion`(`id`);
ALTER TABLE `grado` ADD FOREIGN KEY (`fk_institucion`) REFERENCES `institucion`(`id`);