ALTER TABLE `move`
ADD COLUMN `id`  int UNSIGNED NOT NULL AUTO_INCREMENT FIRST ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
ADD UNIQUE INDEX `idx_move_game_id_move_index` (`game_id`, `move_index`) ;
