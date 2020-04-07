/*
  建表
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for items
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items`
(
  `id`           int(11) NOT NULL AUTO_INCREMENT,
  `userId`       int(11) NOT NULL,
  `content`      varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `expireTime`   datetime                      DEFAULT NULL,
  `completeTime` datetime                      DEFAULT NULL,
  `note`         varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `completed`    tinyint(1)                    DEFAULT NULL,
  `createTime`   datetime                      DEFAULT NULL,
  `updateTime`   datetime                      DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 11
  DEFAULT CHARSET = utf8
  COLLATE = utf8_bin;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`
(
  `id`             int(11) NOT NULL AUTO_INCREMENT,
  `username`       varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `headIcon`       varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `hashedPassword` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `salt`           varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `createTime`     datetime                      DEFAULT NULL,
  `updateTime`     datetime                      DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 2
  DEFAULT CHARSET = utf8
  COLLATE = utf8_bin;

SET FOREIGN_KEY_CHECKS = 1;
