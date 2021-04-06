CREATE TABLE `schema_change_log` (
  `major` int(10) unsigned NOT NULL,
  `minor` int(10) unsigned NOT NULL,
  `patch` int(10) unsigned NOT NULL,
  `date_applied` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`major`,`minor`,`patch`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;