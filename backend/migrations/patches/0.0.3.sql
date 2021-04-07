ALTER TABLE `game`
ADD COLUMN `creator` int UNSIGNED NOT NULL AFTER `status`,
ADD COLUMN `winner`  int UNSIGNED NULL AFTER `creator`;

ALTER TABLE `game` ADD CONSTRAINT `fk_game_creator_player` FOREIGN KEY (`creator`) REFERENCES `player` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `game` ADD CONSTRAINT `fk_game_winner_player` FOREIGN KEY (`winner`) REFERENCES `player` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `game_player`
DROP COLUMN `creator`;