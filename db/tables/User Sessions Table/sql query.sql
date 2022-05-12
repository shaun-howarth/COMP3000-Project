CREATE TABLE `taskacard_sh`.`user_login` (
  `sessionID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `login_date` datetime NOT NULL,
  `login_status` tinyint(1) NOT NULL,
  `login_token` varchar(128) NOT NULL,
  PRIMARY KEY (`sessionID`),
  UNIQUE KEY `login_token` (`login_token`),
  KEY `foreign_key` (`userID`),
  CONSTRAINT `foreign_key` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4