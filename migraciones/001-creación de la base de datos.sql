CREATE DATABASE `bookabook`;
CREATE TABLE `usuarios` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`usuario` VARCHAR(50) NOT NULL,
	`password` VARCHAR(50) NOT NULL,
	`nombre` VARCHAR(50) NOT NULL,
	`apellido` VARCHAR(50) NOT NULL,
	`correo` VARCHAR(75) NOT NULL,
	`dni` INT NULL DEFAULT NULL,
	`estasuscripto` TINYINT(2) NOT NULL DEFAULT 0,
	`numerotarjeta` INT NULL DEFAULT NULL,
	PRIMARY KEY (`id`),
	INDEX `dni` (`dni`)
)
COMMENT='tabla de usuarios'
COLLATE='utf8mb4_0900_ai_ci'
;

CREATE TABLE `libros` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`titulo` VARCHAR(50) NULL DEFAULT NULL,
	`autor` VARCHAR(50) NULL DEFAULT NULL,
	`descripcion` VARCHAR(50) NULL DEFAULT NULL,
	`stock` INT NULL DEFAULT NULL,
	`precio` FLOAT NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COMMENT='tabla de libros'
COLLATE='utf8mb4_0900_ai_ci'
;
