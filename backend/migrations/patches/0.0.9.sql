ALTER TABLE `game_moves`
ADD COLUMN `move_index`  int UNSIGNED NOT NULL DEFAULT 0 AFTER `game_id`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`game_id`, `move_index`);

RENAME TABLE `game_moves` TO `move`;