CREATE SCHEMA IF NOT EXISTS `workout_app_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
-- -----------------------------------------------------
-- Schema workout_app_backend
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `workout_app_db` DEFAULT CHARACTER SET utf8mb4 ;
USE `workout_app_db` ;

-- -----------------------------------------------------
-- Table `workout_app_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app_db`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(124) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app_db`.`workout_sets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app_db`.`workout_sets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `day_of_week` ENUM('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat') NULL DEFAULT NULL,
  `users_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_workout_sets_users_idx` (`users_id` ASC) ,
  CONSTRAINT `fk_workout_sets_users`
    FOREIGN KEY (`users_id`)
    REFERENCES `workout_app_db`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app_db`.`workout_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app_db`.`workout_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category` ENUM('Warm Up', 'Arms', 'Legs', 'Chest', 'Abs', 'Glutes', 'Back', 'Shoulders', 'Upper Body', 'Lower Body') NULL DEFAULT NULL,
  `color` ENUM('gray', 'blue', 'darkblue', 'green', 'darkgreen', 'purple', 'red', 'pink', 'orange', 'black') NOT NULL DEFAULT 'gray',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app_db`.`workout_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app_db`.`workout_items` (
  `id` INT NOT NULL,
  `workout_item` VARCHAR(64) NOT NULL,
  `workout_categories_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_workout_items_workout_categories1_idx` (`workout_categories_id` ASC) ,
  CONSTRAINT `fk_workout_items_workout_categories1`
    FOREIGN KEY (`workout_categories_id`)
    REFERENCES `workout_app_db`.`workout_categories` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app_dbworkout_categories`.`workout_set_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app_db`.`workout_set_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `order` INT NOT NULL,
  `reps` INT NOT NULL DEFAULT 1,
  `sets` INT NOT NULL DEFAULT 1,
  `workout_items_id` INT NOT NULL,
  `workout_sets_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_workout_set_items_workout_items1_idx` (`workout_items_id` ASC) ,
  INDEX `fk_workout_set_items_workout_sets1_idx` (`workout_sets_id` ASC) ,
  CONSTRAINT `fk_workout_set_items_workout_items1`
    FOREIGN KEY (`workout_items_id`)
    REFERENCES `workout_app_db`.`workout_items` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_workout_set_items_workout_sets1`
    FOREIGN KEY (`workout_sets_id`)
    REFERENCES `workout_app_db`.`workout_sets` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


