
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


INSERT INTO survey (title) values ('Survey 1')