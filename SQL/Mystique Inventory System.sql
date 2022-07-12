-- MySQL Workbench Synchronization
-- Generated: 2022-07-12 12:14
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Jevoy Charvis

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER TABLE `inventory`.`stock_has_checkout` 
DROP FOREIGN KEY `fk_stock_has_checkout_stock`;

ALTER TABLE `inventory`.`stock_has_inovice` 
DROP FOREIGN KEY `fk_stock_has_inovice_stock1`;

ALTER TABLE `inventory`.`stock` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
DROP COLUMN `qty`,
ADD COLUMN `stock` INT(11) NULL DEFAULT NULL AFTER `item_name`;

ALTER TABLE `inventory`.`inovice` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `inventory`.`checkout` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `inventory`.`user` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `inventory`.`stock_has_checkout` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `inventory`.`stock_has_inovice` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `inventory`.`purchase` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
DROP COLUMN `orderPrice`,
DROP COLUMN `orderDate`,
ADD COLUMN `orderDate` VARCHAR(32) NULL DEFAULT NULL AFTER `category`,
ADD COLUMN `orderPrice` VARCHAR(32) NULL DEFAULT NULL AFTER `orderDate`;

ALTER TABLE `inventory`.`stock_has_purchase` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `inventory`.`stock_has_checkout` 
ADD CONSTRAINT `fk_stock_has_checkout_stock`
  FOREIGN KEY (`stock_stockid`)
  REFERENCES `inventory`.`stock` (`stockid`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_stock_has_checkout_checkout1`
  FOREIGN KEY (`checkout_checkoutid`)
  REFERENCES `inventory`.`checkout` (`checkoutid`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `inventory`.`stock_has_inovice` 
ADD CONSTRAINT `fk_stock_has_inovice_stock1`
  FOREIGN KEY (`stock_stockid`)
  REFERENCES `inventory`.`stock` (`stockid`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_stock_has_inovice_inovice1`
  FOREIGN KEY (`inovice_invoiceid`)
  REFERENCES `inventory`.`inovice` (`invoiceid`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
