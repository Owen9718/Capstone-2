\connect capstone2

DROP TABLE IF EXISTS Saved_Movies;
DROP TABLE IF EXISTS Users;


CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL,
    password text NOT NULL

);

CREATE TABLE Saved_Movies (
    id SERIAL,
    title text NOT NULL,
    movie_id text NOT NULL,
    user_id int NOT NULL
);



