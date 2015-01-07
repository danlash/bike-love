
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


INSERT INTO survey (title) values ('Survey 1')