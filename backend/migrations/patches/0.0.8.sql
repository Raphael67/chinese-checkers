ALTER TABLE game_player
ADD UNIQUE INDEX `idx_game_player_game_id_color` (`game_id`, `color`) ;

ALTER TABLE `game_player`
MODIFY COLUMN `color`  enum('BLACK','BLUE','PURPLE','YELLOW','GREEN','RED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL AFTER `game_id`;
