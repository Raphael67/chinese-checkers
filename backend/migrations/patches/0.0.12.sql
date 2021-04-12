ALTER TABLE `game_player`
CHANGE COLUMN `color` `position`  tinyint UNSIGNED NOT NULL AFTER `game_id`;