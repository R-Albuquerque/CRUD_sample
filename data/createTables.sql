PRAGMA foreign_keys = on;

DROP TABLE IF EXISTS 'users';
CREATE TABLE 'users' (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` INTEGER default 0
);

DROP TABLE IF EXISTS 'refresh_tokens';
CREATE TABLE 'refresh_tokens' (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` INTEGER NOT NULL,
  CONSTRAINT `token_user`
    FOREIGN KEY(`user_id`)
    REFERENCES 'users'(`id`)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS 'clients';
CREATE TABLE 'clients' (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) default NULL,
  `number_cpf` INTEGER default NULL,
  `creator_id`  INTEGER NOT NULL,
  `creator_username` varchar(255) NOT NULL

);

DROP TABLE IF EXISTS 'emails';
CREATE TABLE 'emails' (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `email` varchar(255) NOT NULL,
  `client_id` INTEGER NOT NULL,
  CONSTRAINT `email_owner`
    FOREIGN KEY(`client_id`)
    REFERENCES 'clients'(`id`)
    ON DELETE CASCADE
);

DROP TABLE IF EXISTS 'phones';
CREATE TABLE 'phones' (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `number` INTEGER NOT NULL,
  `client_id` INTEGER NOT NULL,
  CONSTRAINT `phone_owner`
    FOREIGN KEY(`client_id`)
    REFERENCES 'clients'(`id`)
    ON DELETE CASCADE
)