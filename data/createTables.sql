DROP TABLE IF EXISTS 'users';
CREATE TABLE 'users' (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` INTEGER default 0
)