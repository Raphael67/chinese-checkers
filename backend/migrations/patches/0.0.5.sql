ALTER TABLE player
ADD COLUMN rating FLOAT UNSIGNED AS (win/IF(lose = 0, 1, lose)) PERSISTENT,
ADD INDEX id_player_rating (rating);