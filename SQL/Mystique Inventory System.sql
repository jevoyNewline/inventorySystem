-- MySQL Workbench Synchronization
-- Generated: 2022-07-18 14:49
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Jevoy Charvis

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `inventory` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE IF NOT EXISTS `inventory`.`stock` (
  `stockid` INT(11) NOT NULL AUTO_INCREMENT,
  `item_name` TEXT(200) NULL DEFAULT NULL,
  `stock` INT(11) NULL DEFAULT NULL,
  `descriptions` TEXT(200) NULL DEFAULT NULL,
  `comment` TEXT(200) NULL DEFAULT NULL,
  `brand` VARCHAR(32) NULL DEFAULT NULL,
  `category` VARCHAR(32) NULL DEFAULT NULL,
  `locations` VARCHAR(32) NULL DEFAULT NULL,
  `imageFile` BLOB NULL DEFAULT NULL,
  PRIMARY KEY (`stockid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `inventory`.`inovice` (
  `invoiceid` INT(11) NOT NULL AUTO_INCREMENT,
  `fileurl` LONGTEXT NULL DEFAULT NULL,
  `supplier` VARCHAR(200) NULL DEFAULT NULL,
  `comment` LONGTEXT NULL DEFAULT NULL,
  `date` VARCHAR(32) NULL DEFAULT NULL,
  `time` VARCHAR(32) NULL DEFAULT NULL,
  PRIMARY KEY (`invoiceid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `inventory`.`checkout` (
  `checkoutid` INT(11) NOT NULL AUTO_INCREMENT,
  `item` VARCHAR(200) NULL DEFAULT NULL,
  `qty` INT(11) NULL DEFAULT NULL,
  `comment` LONGTEXT NULL DEFAULT NULL,
  `brand` VARCHAR(50) NULL DEFAULT NULL,
  `category` VARCHAR(50) NULL DEFAULT NULL,
  `date` VARCHAR(50) NULL DEFAULT NULL,
  `time` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`checkoutid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `inventory`.`user` (
  `iduser` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`iduser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `inventory`.`stock_has_checkout` (
  `stock_stockid` INT(11) NOT NULL,
  `checkout_checkoutid` INT(11) NOT NULL,
  PRIMARY KEY (`stock_stockid`, `checkout_checkoutid`),
  INDEX `fk_stock_has_checkout_checkout1_idx` (`checkout_checkoutid` ASC) VISIBLE,
  INDEX `fk_stock_has_checkout_stock_idx` (`stock_stockid` ASC) VISIBLE,
  CONSTRAINT `fk_stock_has_checkout_stock`
    FOREIGN KEY (`stock_stockid`)
    REFERENCES `inventory`.`stock` (`stockid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_stock_has_checkout_checkout1`
    FOREIGN KEY (`checkout_checkoutid`)
    REFERENCES `inventory`.`checkout` (`checkoutid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `inventory`.`stock_has_inovice` (
  `stock_stockid` INT(11) NOT NULL,
  `inovice_invoiceid` INT(11) NOT NULL,
  PRIMARY KEY (`stock_stockid`, `inovice_invoiceid`),
  INDEX `fk_stock_has_inovice_inovice1_idx` (`inovice_invoiceid` ASC) VISIBLE,
  INDEX `fk_stock_has_inovice_stock1_idx` (`stock_stockid` ASC) VISIBLE,
  CONSTRAINT `fk_stock_has_inovice_stock1`
    FOREIGN KEY (`stock_stockid`)
    REFERENCES `inventory`.`stock` (`stockid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_stock_has_inovice_inovice1`
    FOREIGN KEY (`inovice_invoiceid`)
    REFERENCES `inventory`.`inovice` (`invoiceid`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `inventory`.`purchase` (
  `orderID` INT(11) NOT NULL AUTO_INCREMENT,
  `item` VARCHAR(200) NULL DEFAULT NULL,
  `qty` VARCHAR(200) NULL DEFAULT NULL,
  `comment` TEXT(200) NULL DEFAULT NULL,
  `brand` VARCHAR(45) NULL DEFAULT NULL,
  `category` VARCHAR(45) NULL DEFAULT NULL,
  `orderDate` VARCHAR(32) NULL DEFAULT NULL,
  `orderPrice` VARCHAR(32) NULL DEFAULT NULL,
  PRIMARY KEY (`orderID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `inventory`.`stock_has_purchase` (
  `stock_stockid` INT(11) NOT NULL,
  `purchase_orderID` INT(11) NOT NULL,
  PRIMARY KEY (`stock_stockid`, `purchase_orderID`),
  INDEX `fk_stock_has_purchase_purchase1_idx` (`purchase_orderID` ASC) VISIBLE,
  CONSTRAINT `fk_stock_has_purchase_stock1`
    FOREIGN KEY (`stock_stockid`)
    REFERENCES `inventory`.`stock` (`stockid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_stock_has_purchase_purchase1`
    FOREIGN KEY (`purchase_orderID`)
    REFERENCES `inventory`.`purchase` (`orderID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
