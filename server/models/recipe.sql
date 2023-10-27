CREATE DATABASE recipesdb;

CREATE TABLE recipes(
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	prep_time VARCHAR(255) NOT NULL,
	cook_time VARCHAR(255) NOT NULL,
	servings INT NOT NULL,
	ingredients TEXT[] NOT NULL,
	instructions TEXT[] NOT NULL,
	user_ingredients TEXT[] NOT NULL
);

ALTER TABLE recipes
ADD COLUMN user_ingredients TEXT[];

CREATE TABLE recipes2(
	id SERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	prep_time VARCHAR(255) NOT NULL,
	cook_time VARCHAR(255) NOT NULL,
	servings INT NOT NULL,
	ingredients TEXT[] NOT NULL,
	instructions TEXT[] NOT NULL,
	user_ingredients TEXT[] NOT NULL
);


CREATE TABLE ingredients(
	id SERIAL PRIMARY KEY, 
	name VARCHAR(255) NOT NULL
);