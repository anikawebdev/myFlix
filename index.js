const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
const server = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

server.use(express.static('public'));

// Invoke middleware function
server.use(morgan('common'));
server.use(bodyParser.urlencoded({
    extended: true
}));
  
server.use(bodyParser.json());
// server.use(methodOverride());

// Error-handling middleware function
server.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).send('Something broke');
});

//
//  GET REQUESTS
// 
// Return a list of ALL movies to the user
server.get('/movies', (request, response) => {
    Movies.find(
        {},
        { Title: 1 },
    )
    .then((movies) => {
        response.status(201).json(movies);
    })
    .catch((error) => {
        console.error(error);
        response.status(500).send('Error: ' + error);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
server.get('/movies/:Title', (request, response) => {
    Movies.findOne(
        { Title: request.params.Title }
    )
    .then((movie) => {
        response.status(201).json(movie);
    })
    .catch((error) => {
        console.error(error);
        response.status(500).send('Error: ' + error);
    });
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
server.get('/movies/:Title/genre', (request, response) => {
    Movies.findOne(
        { Title: request.params.Title },
        {Title: 1, Genre: 1}
    )
    .then((movie) => {
        response.status(201).json(movie);
    })
    .catch((error) => {
        console.error(error);
        response.status(500).send('Error: ' + error);
    });
});
server.get('/movies/genre/:Name', (request, response) => {
    Movies.findOne(
        { "Genre.Name": request.params.Name },
        {Genre: 1, "_id": 0}
    )
    .then((movie) => {
        response.status(201).json(movie);
    })
    .catch((error) => {
        console.error(error);
        response.status(500).send('Error: ' + error);
    });
});

// Return data about a director (bio, birth year, death year) by name
server.get('/movies/director/:Name', (request, response) => {
    Movies.findOne(
        { "Director.Name": request.params.Name },
        {Director: 1, "_id": 0}
    )
    .then((movie) => {
        response.status(201).json(movie);
    })
    .catch((error) => {
        console.error(error);
        response.status(500).send('Error: ' + error);
    });
});

// 
// POST REQUESTS
// 
// Allow new users to register
server.post('/register', (request, response) => {
    response.send("Successful POST request registration");
});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later
server.post('/users/favorites', (request, response) => {
    response.send("Successful POST request favorites");
});

// 
// PUT REQUESTS
// 
// Allow users to update their user info (username)
server.put('/users/:id', (request, response) => {
    response.send("Successful PUT request update");
});

// 
// DELETE REQUESTS
// 
// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
server.delete('/users/favorites/:id', (request, response) => {
    response.send("Successful DELETE request favorites");
});
// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
server.delete('/users/:id', (request, response) => {
    response.send("Successful DELETE request users");
});

// Port
server.listen(8080);


