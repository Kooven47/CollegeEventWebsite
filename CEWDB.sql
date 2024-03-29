-- MySQL Script generated by MySQL Workbench
-- Sun Apr 16 18:25:12 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema CEWDB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema CEWDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `CEWDB` DEFAULT CHARACTER SET utf8 ;
USE `CEWDB` ;

-- -----------------------------------------------------
-- Table `CEWDB`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`User` (
  `User_ID` VARCHAR(25) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `level` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`Super_Admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`Super_Admin` (
  `User_ID` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE INDEX `User ID_UNIQUE` (`User_ID` ASC),
  CONSTRAINT `Super User ID`
    FOREIGN KEY (`User_ID`)
    REFERENCES `CEWDB`.`User` (`User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`Admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`Admin` (
  `User_ID` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE INDEX `User ID_UNIQUE` (`User_ID` ASC),
  CONSTRAINT `Admin User ID`
    FOREIGN KEY (`User_ID`)
    REFERENCES `CEWDB`.`User` (`User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`Student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`Student` (
  `User_ID` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`User_ID`),
  UNIQUE INDEX `User ID_UNIQUE` (`User_ID` ASC),
  CONSTRAINT `Student User ID`
    FOREIGN KEY (`User_ID`)
    REFERENCES `CEWDB`.`User` (`User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`Event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`Event` (
  `Event_ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Level` INT NOT NULL,
  `Description` VARCHAR(200) NOT NULL,
  `startTime` DATETIME NOT NULL,
  `endTime` DATETIME NOT NULL,
  `Location` VARCHAR(100) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Latitude` DOUBLE NULL,
  `Longitude` DOUBLE NULL,
  `Type` VARCHAR(45) NULL,
  `approved` TINYINT(1) NOT NULL,
  `University_Name` VARCHAR(45) NULL,
  PRIMARY KEY (`Event_ID`),
  UNIQUE INDEX `Event ID_UNIQUE` (`Event_ID` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`University`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`University` (
  `University_Name` VARCHAR(45) NOT NULL,
  `Location` VARCHAR(45) NOT NULL,
  `Description` VARCHAR(200) NOT NULL,
  `Student_Population` INT NOT NULL,
  `Picture` TEXT NULL,
  PRIMARY KEY (`University_Name`),
  UNIQUE INDEX `University Name_UNIQUE` (`University_Name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`RSO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`RSO` (
  `RSO_ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Admin` VARCHAR(25) NOT NULL,
  `Approved` TINYINT(1) NOT NULL,
  `Active` TINYINT(1) NOT NULL,
  PRIMARY KEY (`RSO_ID`),
  UNIQUE INDEX `RSO ID_UNIQUE` (`RSO_ID` ASC),
  UNIQUE INDEX `Name_UNIQUE` (`Name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`creates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`creates` (
  `Super_Admin_User_ID` VARCHAR(25) NOT NULL,
  `University_University_Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Super_Admin_User_ID`, `University_University_Name`),
  INDEX `fk_Super Admin_has_University_University1_idx` (`University_University_Name` ASC),
  INDEX `fk_Super Admin_has_University_Super Admin1_idx` (`Super_Admin_User_ID` ASC),
  CONSTRAINT `fk_Super Admin_has_University_Super Admin1`
    FOREIGN KEY (`Super_Admin_User_ID`)
    REFERENCES `CEWDB`.`Super_Admin` (`User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Super Admin_has_University_University1`
    FOREIGN KEY (`University_University_Name`)
    REFERENCES `CEWDB`.`University` (`University_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`member_of`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`member_of` (
  `index` INT NOT NULL AUTO_INCREMENT,
  `User_ID` VARCHAR(25) NOT NULL,
  `RSO_ID` INT NOT NULL,
  PRIMARY KEY (`index`),
  UNIQUE INDEX `index_UNIQUE` (`index` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`hosts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`hosts` (
  `Event_ID` INT NOT NULL,
  `RSO_RSO_ID` INT NOT NULL,
  PRIMARY KEY (`Event_ID`, `RSO_RSO_ID`),
  UNIQUE INDEX `Event ID_UNIQUE` (`Event_ID` ASC),
  INDEX `fk_hosts_RSO1_idx` (`RSO_RSO_ID` ASC),
  CONSTRAINT `hosts what`
    FOREIGN KEY (`Event_ID`)
    REFERENCES `CEWDB`.`Event` (`Event_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_hosts_RSO1`
    FOREIGN KEY (`RSO_RSO_ID`)
    REFERENCES `CEWDB`.`RSO` (`RSO_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`enrolled`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`enrolled` (
  `User_ID` VARCHAR(25) NOT NULL,
  `University_Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`User_ID`, `University_Name`),
  INDEX `where_idx` (`University_Name` ASC),
  CONSTRAINT `who`
    FOREIGN KEY (`User_ID`)
    REFERENCES `CEWDB`.`User` (`User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `where`
    FOREIGN KEY (`University_Name`)
    REFERENCES `CEWDB`.`University` (`University_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`Approves`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`Approves` (
  `Super_Admin_User_ID` VARCHAR(25) NOT NULL,
  `RSO_RSO ID` INT NOT NULL,
  PRIMARY KEY (`Super_Admin_User_ID`, `RSO_RSO ID`),
  INDEX `fk_Super Admin_has_RSO_RSO1_idx` (`RSO_RSO ID` ASC),
  INDEX `fk_Super Admin_has_RSO_Super Admin1_idx` (`Super_Admin_User_ID` ASC),
  CONSTRAINT `fk_Super Admin_has_RSO_Super Admin1`
    FOREIGN KEY (`Super_Admin_User_ID`)
    REFERENCES `CEWDB`.`Super_Admin` (`User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Super Admin_has_RSO_RSO1`
    FOREIGN KEY (`RSO_RSO ID`)
    REFERENCES `CEWDB`.`RSO` (`RSO_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `owner` VARCHAR(25) NOT NULL,
  `commentString` VARCHAR(200) NOT NULL,
  `rating` INT NULL,
  `Event_ID` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`Event_has_comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`Event_has_comments` (
  `Event_Event_ID` INT NOT NULL,
  `comments_id` INT NOT NULL,
  PRIMARY KEY (`Event_Event_ID`, `comments_id`),
  INDEX `fk_Event_has_comments_Event1_idx` (`Event_Event_ID` ASC),
  CONSTRAINT `fk_Event_has_comments_Event1`
    FOREIGN KEY (`Event_Event_ID`)
    REFERENCES `CEWDB`.`Event` (`Event_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`University_has_RSO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`University_has_RSO` (
  `University_University_Name` VARCHAR(45) NOT NULL,
  `RSO_RSO_ID` INT NOT NULL,
  PRIMARY KEY (`University_University_Name`, `RSO_RSO_ID`),
  INDEX `fk_University_has_RSO_RSO1_idx` (`RSO_RSO_ID` ASC),
  INDEX `fk_University_has_RSO_University1_idx` (`University_University_Name` ASC),
  CONSTRAINT `fk_University_has_RSO_University1`
    FOREIGN KEY (`University_University_Name`)
    REFERENCES `CEWDB`.`University` (`University_Name`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_University_has_RSO_RSO1`
    FOREIGN KEY (`RSO_RSO_ID`)
    REFERENCES `CEWDB`.`RSO` (`RSO_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `CEWDB`.`student_rate_Event`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CEWDB`.`student_rate_Event` (
  `Student_User_ID` VARCHAR(25) NOT NULL,
  `Event_Event_ID` INT NOT NULL,
  `rate` INT NULL,
  PRIMARY KEY (`Student_User_ID`, `Event_Event_ID`),
  INDEX `fk_Student_has_Event_Event1_idx` (`Event_Event_ID` ASC),
  INDEX `fk_Student_has_Event_Student1_idx` (`Student_User_ID` ASC),
  CONSTRAINT `fk_Student_has_Event_Student1`
    FOREIGN KEY (`Student_User_ID`)
    REFERENCES `CEWDB`.`Student` (`User_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Student_has_Event_Event1`
    FOREIGN KEY (`Event_Event_ID`)
    REFERENCES `CEWDB`.`Event` (`Event_ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `CEWDB`;

DELIMITER $$
USE `CEWDB`$$
CREATE DEFINER = CURRENT_USER TRIGGER `CEWDB`.`rsoActiveTriggerDeletion` AFTER DELETE ON `member_of` FOR EACH ROW
BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM member_of WHERE RSO_ID = OLD.RSO_ID;

    IF count >= 5 THEN
        UPDATE rso SET active = true WHERE RSO_ID = OLD.RSO_ID;
    ELSE
        UPDATE rso SET active = false WHERE RSO_ID = OLD.RSO_ID;
    END IF;
END$$

USE `CEWDB`$$
CREATE DEFINER = CURRENT_USER TRIGGER `CEWDB`.`rsoActiveTriggerInsertion` AFTER INSERT ON `member_of` FOR EACH ROW
BEGIN
	DECLARE count INT;
    SELECT COUNT(*) INTO count FROM member_of WHERE RSO_ID = NEW.RSO_ID;

    IF count >= 5 THEN
        UPDATE rso SET active = true WHERE RSO_ID = NEW.RSO_ID;
    ELSE
        UPDATE rso SET active = false WHERE RSO_ID = NEW.RSO_ID;
    END IF;
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
