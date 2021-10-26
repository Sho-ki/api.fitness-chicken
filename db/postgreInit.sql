CREATE SEQUENCE users_seq;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL DEFAULT NEXTVAL ('users_seq'),
  email VARCHAR(124) NOT NULL,
  password VARCHAR(256) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT id_UNIQUE_users UNIQUE (id) ,
  CONSTRAINT email_UNIQUE UNIQUE (email) )
;


CREATE SEQUENCE workout_sets_seq;

CREATE TYPE day_of_week_enum AS ENUM('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
CREATE TABLE IF NOT EXISTS workout_sets (
  id INT NOT NULL DEFAULT NEXTVAL ('workout_sets_seq'),
  day_of_week day_of_week_enum NULL DEFAULT NULL,
  users_id INT NOT NULL REFERENCES "users" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (id),
  UNIQUE (id));
 
CREATE SEQUENCE workout_categories_seq;

 CREATE TYPE category_enum AS ENUM('Warm Up', 'Arms', 'Legs', 'Chest', 'Abs', 'Glutes', 'Back', 'Shoulders', 'Upper Body', 'Lower Body') ;
  CREATE TYPE color_enum AS ENUM ('gray', 'blue', 'darkblue', 'green', 'darkgreen', 'purple', 'red', 'pink', 'orange', 'black') ;

CREATE TABLE IF NOT EXISTS workout_categories (
  id INT NOT NULL DEFAULT NEXTVAL ('workout_categories_seq'),
  category category_enum DEFAULT NULL,
  color color_enum NOT NULL DEFAULT 'gray',
  users_id INT NOT NULL REFERENCES "users" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (id),
  CONSTRAINT id_UNIQUE_category UNIQUE (id))
  ;
;

CREATE INDEX fk_workout_categories_users_idx ON workout_categories (users_id ASC);



CREATE SEQUENCE workout_items_seq;

CREATE TABLE IF NOT EXISTS workout_items (
  id INT NOT NULL DEFAULT NEXTVAL ('workout_items_seq'),
  workout_item VARCHAR(64) NOT NULL,
  workout_categories_id INT NOT NULL REFERENCES "workout_categories" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (id),
  CONSTRAINT id_UNIQUE_items UNIQUE (id)) ;

CREATE INDEX fk_workout_items_workout_categories_idx ON workout_items (workout_categories_id ASC);



CREATE SEQUENCE workout_set_items_seq;

CREATE TABLE IF NOT EXISTS workout_set_items (
  id INT NOT NULL DEFAULT NEXTVAL ('workout_set_items_seq'),
  set_order INT NULL,
  reps INT NOT NULL DEFAULT 10,
  sets INT NOT NULL DEFAULT 3,
  workout_items_id INT NOT NULL REFERENCES "workout_items" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  workout_sets_id INT NOT NULL REFERENCES "workout_sets" (id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (id),
  CONSTRAINT id_UNIQUE_set_items UNIQUE (id))
;

CREATE INDEX fk_workout_set_items_workout_items_idx ON workout_set_items (workout_items_id ASC);
CREATE INDEX fk_workout_set_items_workout_sets_idx ON workout_set_items (workout_sets_id ASC);