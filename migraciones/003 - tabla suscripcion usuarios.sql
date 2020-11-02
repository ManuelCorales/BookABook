CREATE TABLE `usuario_librossuscripcion` (
	`id` INT NOT NULL,
	`id_usuario` INT NOT NULL,
	`id_libro` INT NOT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_0900_ai_ci'
;

ALTER TABLE `usuario_librossuscripcion`
	CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT FIRST;
