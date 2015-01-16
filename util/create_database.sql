
DROP TABLE IF EXISTS answer;
DROP TABLE IF EXISTS participant;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS survey;

CREATE TABLE survey
(
  id serial NOT NULL,
  title text,
  text text,
  CONSTRAINT survey_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


CREATE TABLE question
(
  id serial NOT NULL,
  text text,
  type text,
  choices text,
  survey_id integer,
  CONSTRAINT question_pk PRIMARY KEY (id),
  CONSTRAINT question_fk_survey FOREIGN KEY (survey_id)
      REFERENCES survey (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

CREATE TABLE participant
(
  id serial NOT NULL,
  first_name text,
  last_name text,
  email_address text,
  age_bracket text,
  gender text,
  sexual_preference text,
  CONSTRAINT participant_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);


CREATE TABLE answer
(
  id serial NOT NULL,
  question_id integer,
  participant_id integer,
  answer text,
  CONSTRAINT answer_pk PRIMARY KEY (id),
  CONSTRAINT answer_fk_question FOREIGN KEY (question_id)
      REFERENCES question (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT answer_fk_participant FOREIGN KEY (participant_id)
      REFERENCES participant (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);


INSERT INTO survey (title, text) values ('Valentine''s Day Bicycle Speed Dating', 'Are you ready for Bike Love??? We sure hope so! We at the Atlanta Cycling Festival have been hard at work on our Algorithm of Bike Love™ ®  (Patent Pending) and we''re excited to match you with your potential Bike Love Partner! Please fill out the questions below as accurately as possible. Proceeds go toward Atlanta Cycling Festival.');
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('If you were a bike, what type of bike would you be?', 'multiplechoice', 'Fixed Gear|Single Speed|Road Bike|Commuter Bike|Hybrid Bike|Beach Cruiser|Tri-Bike|Mountain Bike|BMX|Unicycle', 1);
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('It''s Saturday afternoon and the weather is perfect... what would you do?', 'multiplechoice', 'Go for a light bike ride around the city|Sleep the day away|Go for a long, hard and intense training ride|Go on a hike|Netflix binge.... all today|Watch sports until my eyes hurt|Decide it''s a fine time to learn a new hobby|Try a new recipe|Get some friends together to bike and explore|Bloody Marys - To remedy my hangover', 1);
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('I am a...', 'multiplechoice', 'Night Owl|Early Morning Riser|I do both', 1);
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('My favorite place in Atlanta is...', 'freeform', '', 1);
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('What is your favorite game?', 'multiplechoice', 'Monopoly|Twister|Settlers of Catan|Chess|Cards Against Humanity', 1);
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('How spicy do you like your food?', 'multiplechoice', '0 Pepper (not spicy)|1 Pepper|2 Peppers|3 Peppers (As spicy as you can make it!)', 1);
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('Which is absolutely, hands down, the most freakin'' adorable?', 'multiplechoice', 'Puppies/Dogs|Kittens/Cats|Babies|Barf - None of these', 1);
INSERT INTO question (text, type, choices, survey_id) 
  VALUES ('What is your best knock knock joke?', 'freeform', '', 1);

