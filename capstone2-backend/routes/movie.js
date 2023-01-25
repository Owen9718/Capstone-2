const express = require("express");
const axios = require("axios")
const router = express.Router();
let session = require('express-session');
const db = require("../db");

const options = {
    method: 'GET',
    url: 'https://movie-database-alternative.p.rapidapi.com/',
    params: { r: 'json', page: '1' },
    headers: {
        'X-RapidAPI-Key': '8700ece786msh86fbdf1c90fc4cfp1bf93bjsn7540deb0f885',
        'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
    }
};
const info = {
    method: 'GET',
    url: 'https://movie-database-alternative.p.rapidapi.com/',
    params: { r: 'json', page: '1' },
    headers: {
        'X-RapidAPI-Key': '8700ece786msh86fbdf1c90fc4cfp1bf93bjsn7540deb0f885',
        'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
    }
};

router.get("/:movie", async function (req, res) {
    options.params.s = req.params.movie
    let mov = await axios.request(options).then(function (response) {
        return (response.data);
    }).catch(function (error) {
        console.error(error);
    });
    return res.json(mov)
})

router.get("/check/saved/:userId/:movieId", async function (req, res) {
    const { userId, movieId } = req.params

    const savedMovies = await db.query(
        `SELECT title, movie_id, user_id FROM saved_movies
        WHERE movie_id = $1 and user_id = $2`, [movieId, userId]
    )

    return res.json(savedMovies.rows[0])

})

router.post("/save", async function (req, res) {
    const body = req.body

    const result = await db.query(
        `INSERT INTO saved_movies
           (title,
            movie_id,
            user_id)
           VALUES ($1, $2,$3)
           RETURNING title`,
        [
            body.Title,
            body.imdbID,
            body.userId
        ],
    );
    const movie = result.rows[0];

    return res.json(movie);
})

router.post("/delete", async function (req, res) {
    const { imdbID, userId } = req.body
    console.log(req.body)
    const deleted = await db.query(
        `DELETE FROM saved_movies
        WHERE movie_id = $1 and user_id = $2
        RETURNING user_id`,
        [imdbID, userId]
    )


    return res.json(deleted)
})

router.get("/id/:movieId", async function (req, res) {
    info.params.i = req.params.movieId
    let mov = await axios.request(info).then(function (response) {
        return (response.data);
    }).catch(function (error) {
        console.error(error);
    });

    return res.json(mov);

})

router.get("/user/:userId", async function (req, res) {
    const userId = req.params.userId
    const savedMovies = await db.query(
        `SELECT * FROM saved_movies
        WHERE user_id = $1`, [userId]
    )

    return res.json(savedMovies.rows)

})




module.exports = router;
