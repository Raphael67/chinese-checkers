CREATE TABLE `player` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nickname` char(32) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `game` (
  `id` char(36) CHARACTER SET latin1 NOT NULL,
  `status` enum('CREATED','IN_PROGRESS','TERMINATED') NOT NULL DEFAULT 'CREATED',
  `rounds` int unsigned NOT NULL DEFAULT 1,
  `longest_streak` int unsigned NOT NULL default 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_game_rounds` (`rounds`),
  KEY `id_game_longest_streak` (`longest_streak`)
) ENGINE=InnoDB;

CREATE TABLE `game_player` (
  `player_id` int(10) unsigned NOT NULL,
  `game_id` char(36) CHARACTER SET latin1 NOT NULL,
  `color` enum('Black','Blue','Purple','Yellow','Green','Red') NOT NULL,
  `creator` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`player_id`,`game_id`),
  CONSTRAINT `fk_game_player_game` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_game_player_player` FOREIGN KEY (`player_id`) REFERENCES `player` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `game_moves` (
  `game_id` char(36) CHARACTER SET latin1 NOT NULL,
  `moves` longtext CHARACTER SET latin1 DEFAULT '{ "moves": []}' CHECK (json_valid(`moves`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`game_id`),
  CONSTRAINT `fk_game_moves_game` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `check_json_moves` CHECK (json_valid(`moves`))
) ENGINE=InnoDB;