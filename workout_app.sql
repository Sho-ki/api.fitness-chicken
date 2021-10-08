CREATE SCHEMA IF NOT EXISTS `workout_app` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `workout_app` ;

-- -----------------------------------------------------
-- Table `workout_app`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(245) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app`.`user_follows`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app`.`user_follows` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `followee_id` INT NOT NULL,
  `status` ENUM('Waiting', 'Approved', 'Rejected') NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_follows_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_follows_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `workout_app`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app`.`user_workouts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app`.`user_workouts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `scheduled_day` ENUM('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat') NULL DEFAULT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_user_workouts_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_workouts_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `workout_app`.`user` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app`.`workout_categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app`.`workout_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `label` VARCHAR(45) NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_workout_categories_user_idx` (`user_id` ASC),
  CONSTRAINT `fk_workout_categories_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `workout_app`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `workout_app`.`workout_sets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `workout_app`.`workout_sets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `training_name` VARCHAR(45) NOT NULL,
  `sets` INT NOT NULL,
  `times` INT NOT NULL,
  `order_index` INT NOT NULL,
  `workout_categories_id` INT NOT NULL,
  `user_workouts_id` INT NOT NULL,
  `user_workouts_user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_workouts_id`, `user_workouts_user_id`),
  INDEX `fk_workout_sets_workout_categories_idx` (`workout_categories_id` ASC),
  INDEX `fk_workout_sets_user_workouts_idx` (`user_workouts_id` ASC, `user_workouts_user_id` ASC),
  CONSTRAINT `fk_workout_sets_user_workouts`
    FOREIGN KEY (`user_workouts_id` , `user_workouts_user_id`)
    REFERENCES `workout_app`.`user_workouts` (`id` , `user_id`),
  CONSTRAINT `fk_workout_sets_workout_categories`
    FOREIGN KEY (`workout_categories_id`)
    REFERENCES `workout_app`.`workout_categories` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;