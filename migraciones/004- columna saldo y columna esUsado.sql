ALTER TABLE `usuarios`
	ADD COLUMN `saldo` FLOAT NOT NULL DEFAULT '0' AFTER `numerotarjeta`;

GO;

ALTER TABLE `libros`
	ADD COLUMN `esUsado` TINYINT(1) NOT NULL DEFAULT '0' AFTER `slug`;
