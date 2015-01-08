
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
  surveyid integer,
  CONSTRAINT question_pk PRIMARY KEY (id),
  CONSTRAINT question_fk_survey FOREIGN KEY (surveyid)
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


INSERT INTO survey (title) values ('Survey 1')