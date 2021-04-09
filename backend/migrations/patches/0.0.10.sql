ALTER TABLE `move`
CHANGE COLUMN `moves` `path`  longtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL AFTER `move_index`;